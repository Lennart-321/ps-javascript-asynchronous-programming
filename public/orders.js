// axios
//   .get("http://localhost:3000/api/orders/999")
//   .then((result) => {
//     if (result.status === 200) {
//       showOrderList("#order-list", result.data);
//     } else {
//       showError("Error!");
//     }
//   })
//   .catch((err) => showError("#order-list", err))
//   .finally(() => hideWaiting());

// showWaiting();

//////////////////////////////////////

// let statuses = [];

// axios
//   .get("http://localhost:3000/api/orderStatuses")
//   .then(({ data }) => {
//     statuses = data;
//     return axios.get("http://localhost:3000/api/orders");
//   })
//   .then(({ data }) => {
//     let orders = data.map((o) => {
//       return {
//         ...o,
//         orderStatus: statuses.find((d) => d.id === o.orderStatusId).description,
//       };
//     });
//     showOrderList("#order-list", orders);
//   })
//   .catch((err) => showError("#order-list", err))
//   .finally(() => setTimeout(hideWaiting, 1000));

////////////////////////////////

function checkErrorAndAlert(result) {
  if (result.status === "rejected") {
    //status !== 'fulfilled'
    window.alert("ERROR: " + result.reason.message);
  }
}

let statPrm = axios.get("http://localhost:3000/api/orderStatuses");
let addrPrm = axios.get("http://localhost:3000/api/addresses");
//let atyPrm = axios.get("http://localhost:3000/api/addressTypes");
let ordPrm = axios.get("http://localhost:3000/api/orders");

//new Promise((resolve, reject) => { /*...*/ resolve(); /*...or...*/ reject(); /*...*/ });

//new Promise starts in pending state
let atyPrm = new Promise(function executorFunction(
  resolveFunction,
  rejectFunction
) {
  // setInterval(() => {
  //   resolveFunction("timeout");
  // }, 1500);
  // setTimeout(() => {
  //   resolveFunction("timeout");
  // }, 5000);
  resolveFunction("Resolving promise immediate.");
  console.log("Promise executor function ending");
  return "Promise fulfilled!";
});
atyPrm.then((x) => console.log("Arg to then:" + x));
console.log("Continue after new Promise creation");

//all, allSettled, any, race

//Promise.all([statPrm, addrPrm, atyPrm, ordPrm]);

//Promise.any([...]) :
//   Returns single result when any is fullfilled - or - all is rejected
//   all rejected not handled by 'then' (?)
//Promise.race([...]) :
//   Returns single result when any is resolved(i.e.fullfilled or rejected)
//   rejection not handled by 'then'

// {status:'fulfilled', value: {....}}
// {status:'rejected', reason: {....}}
Promise.allSettled([statPrm, addrPrm, atyPrm, ordPrm])
  .then(([statRes, addrRes, atyRes, ordRes]) => {
    checkErrorAndAlert(statRes);
    checkErrorAndAlert(addrRes);
    checkErrorAndAlert(atyRes);
    checkErrorAndAlert(ordRes);

    let orders = ordRes.value.data.map((o) => {
      const addr = addrRes.value.data.find((a) => a.id === o.shippingAddress);
      return {
        ...o,
        orderStatus: statRes.value.data.find((d) => d.id === o.orderStatusId)
          .description,
        shippingAddressText: `${addr.street} ${addr.city} ${addr.state} ${addr.zipCode}`,
      };
    });
    showOrderList("#order-list", orders);
  })
  //No catch needed (always fulfilled (!?))...
  //...can still be included for error in 'then'
  .catch((err) => showError("#order-list", err))
  .finally(() => setTimeout(hideWaiting, 10));

// let statuses = [];
// let xhr = new XMLHttpRequest();

// xhr.open("GET", "http://localhost:3000/api/orderStatuses");
// xhr.onload = () => {
//   statuses = JSON.parse(xhr.responseText);

//   let xhr2 = new XMLHttpRequest();
//   xhr2.open("GET", "http://localhost:3000/api/orders");
//   xhr2.onload = () => {
//     const orders = JSON.parse(xhr2.responseText);
//     const fullOrders = orders.map((o) => {
//       o.orderStatus = statuses.find(
//         (s) => s.id === o.orderStatusId
//       ).description;
//       return o;
//     });

//     showOrderList("#order-list", fullOrders);
//   };
//   xhr2.send();
// };
// xhr.send();
