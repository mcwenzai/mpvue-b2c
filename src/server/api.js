import fly from "../utils/request";

export const addAddress = data => {
    return fly.post("/address/add", data).then();
};

export const getAddressList = data => {
    return fly.post("/address/list", data).then();
};
