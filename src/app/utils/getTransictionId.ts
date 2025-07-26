export const getTransactionId = () => {
  return `tan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
