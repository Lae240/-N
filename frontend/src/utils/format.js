export const formatMoney = (number) => {
  if (!number) return "0đ";

  return new Intl.NumberFormat("vi-VN").format(number) + "đ";
};