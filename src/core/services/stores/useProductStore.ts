import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  addProducts,
  getProducts,
  updateGallery,
  updateProductDetails,
  updateProductListing,
  updateProductPrice,
} from "../api/productapi";
import notification from "../notification";

// Zustand implementation
type ProductState = {
  isLoading: boolean;
  errors: any | {};
  productList: ProductList;
  reset: () => void;
  updateError: (name: string) => void;
  clearError: () => void;
  getProducts: (ownerId: string, param: SearchParam) => void;
  addProduct: (product: NewProduct) => void;
  updateProductDetail: (detail: ProductDetail, productId: string) => void;
  updateProductPrice: (price: ProductPrice, productId: string) => void;
  updateProductListing: (listing: ProductListing, productId: string) => void;
  updateGallery: (gallery: any, productId: string) => Promise<UIResponse>;
};

const useProductStore = create<ProductState>()(
  devtools(
    persist(
      (set, get): ProductState => ({
        isLoading: false,
        errors: {},
        productList: {
          items: [],
          currentPage: 0,
          totalItem: 0,
          totalPage: 0,
        },
        reset: () => {
          set({
            isLoading: false,
            errors: {},
            productList: {
              items: [],
              currentPage: 0,
              totalItem: 0,
              totalPage: 0,
            },
          });
          sessionStorage.removeItem("productstate");
        },
        updateError: (name) =>
          set((state) => ({
            errors: {
              ...state.errors,
              [name]: "",
            },
          })),
        clearError: () => {
          set({ errors: {} });
        },
        getProducts: async (ownerId, SearchParam) => {
          set({ isLoading: true });
          const response = await getProducts(ownerId, SearchParam);
          const { success, data } = response;
          if (success) {
            set({ productList: data });
          }
          set({ isLoading: false });
        },
        addProduct: async (product) => {
          try {
            set({ isLoading: true });
            const response = await addProducts(product);
            const { success, statusCode, data, message } = response;
            if (success) {
              set((state) => ({
                productList: {
                  ...state.productList,
                  totalItem: state.productList.totalItem + 1,
                  items: [
                    {
                      ...data,
                    },
                    ...state.productList.items,
                  ],
                },
              }));
              notification({
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        updateProductDetail: async (detail, productId) => {
          try {
            set({ isLoading: true });
            const response = await updateProductDetails(detail, productId);

            const { success, statusCode, data, message } = response;
            if (success) {
              set((state) => ({
                productList: {
                  ...state.productList,
                  items: state.productList?.items?.map((product: any) =>
                    product.id === productId ? { ...data } : product
                  ),
                },
              }));
              notification({
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        updateProductListing: async (listing, productId) => {
          try {
            set({ isLoading: true });
            const response = await updateProductListing(listing, productId);

            const { success, statusCode, data, message } = response;
            if (success) {
              set((state) => ({
                productList: {
                  ...state.productList,
                  items: state.productList?.items?.map((product: any) =>
                    product.id === productId ? { ...data } : product
                  ),
                },
              }));
              notification({
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        updateProductPrice: async (price, productId) => {
          try {
            set({ isLoading: true });
            const response = await updateProductPrice(price, productId);

            const { success, statusCode, data, message } = response;
            if (success) {
              set((state) => ({
                productList: {
                  ...state.productList,
                  items: state.productList?.items?.map((product: any) =>
                    product.id === productId ? { ...data } : product
                  ),
                },
              }));
              notification({
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        updateGallery: async (gallery, productId) => {
          try {
            set({ isLoading: true });
            const response = await updateGallery(gallery, productId);

            const { success, statusCode, data, message } = response;

            if (success) {
              set((state) => ({
                productList: {
                  ...state.productList,
                  items: state.productList?.items?.map((product: any) =>
                    product.id === productId ? { ...data } : product
                  ),
                },
              }));
              notification({
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return response;
          } catch (err) {
            set({ isLoading: false });
            notification({
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
      }),
      { name: "productstate", storage: createJSONStorage(() => sessionStorage) }
    )
  )
);

export default useProductStore;
