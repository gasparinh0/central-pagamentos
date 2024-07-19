import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (message, position, timeClose) => {
  toast.success(message || "Sucesso!", {
    position: position || "bottom-left",
    autoClose: timeClose || 500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
  })
}
