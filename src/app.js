export const dva = {
    config: {
      onError(e) {
        e.preventDefault();
        console.error(e.message);
      },
    },
  };
  // 解决error 报错