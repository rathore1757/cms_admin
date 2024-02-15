import * as Yup from "yup";
export const AddCountryInVariantSchema = Yup.object({
  stock: Yup.number().integer().required("Stock is required"),
  price: Yup.number().integer().required("Price is required"),
  discount: Yup.number().integer().required("Disount is required"),
});
