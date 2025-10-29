import { useEffect } from "react";

/**
 * Custom hook để tự động ẩn message sau một khoảng thời gian
 * @param {string} message - Message cần hiển thị
 * @param {Function} setMessage - Function để update message
 * @param {number} duration - Thời gian hiển thị message (tính bằng milliseconds)
 */
const useAutoHideMessage = (message, setMessage, duration = 5000) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, duration);

      // Cleanup function để clear timer khi component unmount hoặc message thay đổi
      return () => clearTimeout(timer);
    }
  }, [message, setMessage, duration]);
};

export default useAutoHideMessage;
