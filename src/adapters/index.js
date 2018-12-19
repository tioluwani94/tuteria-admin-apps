import devAdapter from "./dev";
export { devAdapter };

export function filterHelper(
  data,
  { searchParam, dateFilter, filter },
  filterFunc
) {
  let search = searchParam.toLowerCase();
  let result = data;
  if (Boolean(searchParam)) {
    result = data.filter(
      x =>
        x.order.toLowerCase().includes(search) ||
        x.email.toLowerCase().includes(search)
    );
  }
  if (Boolean(dateFilter.from) && Boolean(dateFilter.to)) {
    result = result.filter(x => {
      let from = new Date(dateFilter.from);
      let to = new Date(dateFilter.to);
      let date = new Date(x.date);
      return date.getTime() >= from.getTime() && date.getTime() <= to.getTime();
    });
  }
  if (Boolean(filter)) {
    let condition = x =>
      filter === "verified" ? filterFunc(x.order) : !filterFunc(x.order);
    result = result.filter(condition);
  }
  return result;
}
