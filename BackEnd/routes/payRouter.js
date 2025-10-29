// payRouter.js - Hoàn chỉnh cho localhost:8080 & localhost:3000

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const https = require('https');
const Invoice = require("../schemas/invoicePayments/invoice.model");
const RepairStatus = require('../schemas/repairScheduling/repairStatus.model');

// ===== MOMO CONFIG (Test Environment) =====
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const requestType = "payWithMethod";
const autoCapture = true;
const lang = 'vi';
const hostname = 'test-payment.momo.vn';
const momoEndpoint = '/v2/gateway/api/create';

// ===== URL THỰC TẾ LOCAL =====
const FRONTEND_BASE_URL = 'http://localhost:8080';  // Frontend của bạn
const BACKEND_BASE_URL = 'http://localhost:3000';   // Backend của bạn

// POST /pay/momo - Tạo link thanh toán MoMo
router.post('/momo', async (req, res) => {
  try {
    const { invoiceId, amount } = req.body;
    
    if (!invoiceId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu invoiceId hoặc amount' 
      });
    }

    // Tạo orderId & requestId unique
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = invoiceId; // Truyền invoiceId qua extraData để IPN nhận
    const orderInfo = 'Thanh toán sửa chữa TechMate';

    // URL redirect sau khi thanh toán thành công (SAU OTP)
    const redirectUrl = `${FRONTEND_BASE_URL}/user/profile/history?pay=success&extraData=${extraData}`;
    
    // URL IPN (server-to-server - MoMo gọi backend)
    const ipnUrl = 'https://lizabeth-unblended-brightly.ngrok-free.dev/pay/momo/ipn';

    console.log('🔗 Redirect URL:', redirectUrl);
    console.log('🔗 IPN URL:', ipnUrl);

    // Tạo raw signature cho MoMo
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Tạo signature
    const signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    console.log('📝 Raw Signature:', rawSignature);
    console.log('🔐 Signature:', signature);

    // Body gửi MoMo
    const requestBody = JSON.stringify({
      partnerCode,
      partnerName: "TechMate",
      storeId: "TechMateStore",
      requestId,
      amount: amount.toString(), // MoMo yêu cầu string
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      orderGroupId: '',
      signature
    });

    // Options gửi request tới MoMo
    const options = {
      hostname,
      port: 443,
      path: momoEndpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    // Gửi request tới MoMo
    const momoReq = https.request(options, (momoRes) => {
      let body = '';
      momoRes.on('data', (chunk) => { body += chunk; });
      momoRes.on('end', () => {
        try {
          const responseData = JSON.parse(body);
          console.log('✅ MoMo Response:', responseData);
          
          if (responseData.resultCode === 0) {
            // Trả payUrl về frontend
            res.json({ 
              success: true, 
              payUrl: responseData.payUrl,
              orderId: responseData.orderId 
            });
          } else {
            console.error('❌ MoMo tạo payment thất bại:', responseData);
            res.status(500).json({ 
              success: false, 
              message: responseData.message || 'Tạo link MoMo thất bại' 
            });
          }
        } catch (err) {
          console.error('❌ Parse MoMo response error:', err);
          res.status(500).json({ success: false, message: 'Lỗi xử lý response MoMo' });
        }
      });
    });

    momoReq.on('error', (e) => {
      console.error('❌ MoMo request error:', e);
      res.status(500).json({ success: false, message: `Lỗi kết nối MoMo: ${e.message}` });
    });

    momoReq.write(requestBody);
    momoReq.end();

  } catch (error) {
    console.error('❌ POST /pay/momo error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// POST /pay/momo/ipn - NHẬN IPN TỪ MOMO (Server-to-Server)
router.post('/momo/ipn', async (req, res) => {
  try {
    const data = req.body;
    console.log('📨 [IPN] MoMo gửi notification:', data);

    // VERIFY SIGNATURE (BẮT BUỘC - AN TOÀN)
    const rawSignature = `accessKey=${accessKey}&amount=${data.amount}&extraData=${data.extraData}&message=${data.message}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&orderType=${data.orderType}&partnerCode=${data.partnerCode}&payType=${data.payType}&requestId=${data.requestId}&responseTime=${data.responseTime}&resultCode=${data.resultCode}&transId=${data.transId}`;
    
    const expectedSignature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    if (expectedSignature !== data.signature) {
      console.error('❌ [IPN] Signature KHÔNG hợp lệ!');
      return res.status(400).send('Invalid signature');
    }

    // ✅ THANH TOÁN THÀNH CÔNG (resultCode = 0)
    if (parseInt(data.resultCode) === 0) {
      const invoiceId = data.extraData;

      console.log('💰 [IPN] Cập nhật trạng thái cho invoice:', invoiceId);

      // 1. CẬP NHẬT INVOICE → PAID
      const invoice = await Invoice.findById(invoiceId);
      if (invoice && invoice.status !== 'Paid') {
        invoice.status = 'Paid';
        invoice.paidAt = new Date();
        await invoice.save();
        console.log('✅ [IPN] Invoice cập nhật PAID:', invoiceId);
      }

      // 2. CẬP NHẬT REPAIRSTATUS → COMPLETED
      const repairStatus = await RepairStatus.findOne({ appointmentId: invoice.appointmentId });
      if (repairStatus && repairStatus.status !== 'Completed') {
        repairStatus.status = 'Completed';
        repairStatus.statusLog.push({ 
          status: 'Completed', 
          time: new Date(),
          note: 'Hoàn thành sau thanh toán MoMo'
        });
        await repairStatus.save();
        console.log('✅ [IPN] RepairStatus cập nhật COMPLETED:', invoice.appointmentId);
      }

      console.log('🎉 [IPN] Hoàn tất cập nhật trạng thái!');
      
      // MoMo yêu cầu trả 204 No Content
      res.status(204).send();
      
    } else {
      console.log('❌ [IPN] Thanh toán thất bại:', data.message);
      res.status(204).send(); // Vẫn trả 204 cho MoMo
    }

  } catch (error) {
    console.error('❌ [IPN] Lỗi xử lý:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;