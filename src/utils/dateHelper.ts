export const convertToJalali = (dateString:string) => {
    if (!dateString) return "تاریخ نامشخص";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };