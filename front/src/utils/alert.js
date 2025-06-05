import Swal from "sweetalert2";

export const showSuccess = (title, text = "") => {
  Swal.fire({
    title,
    text,
    icon: "success",
    toast: true,
    timer: 6000,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showError = (title, text = "") => {
  Swal.fire({
    title,
    text,
    icon: "error",
    toast: true,
    timer: 6000,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: true,
  });
};

export const showWarning = (title, text = "") => {
  Swal.fire({
    title,
    text,
    icon: "warning",
    toast: true,
    timer: 6000,
    position: "top-right",
    timerProgressBar: true,
    showConfirmButton: true,
  });
};
