const convertDate = (date: Date | string | number) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

export {convertDate};
