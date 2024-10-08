import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  addBankAccount,
  addEmployee,
  addEmployer,
  assignEmployee,
  deleteBankAccount,
  deleteEmployee,
  editEmployer,
  getBankAccounts,
  getEmployees,
  getOtp,
  login,
  resetUserPassword,
  updateEmployeeStatus,
  verifyEmployer,
} from "../api/userapi";
import notification from "core/services/notification";
import { getAccess } from "../accessControls";

// Zustand implementation
type UserState = {
  isLoading: boolean;
  isEmployer: boolean;
  errors: any | {};
  user: any | {};
  employees: Employee[];
  access: any | {};
  bankAccounts: BankAccount[];
  reset: () => void;
  updateError: (name: string) => void;
  login: (email: string, password: string, isEmployer: boolean) => void;
  getOtp: (email: string) => void;
  getEmployees: () => void;
  addEmployer: (employer: NewEmployer) => void;
  editEmployer: (employer: UpdateEmployer) => void;
  verifyEmployer: (email: string, otp: string) => void;
  resetPassword: (resetPassword: ResetPassword, isEmployer: boolean) => void;
  addEmployee: (employee: NewEmployee) => void;
  assignEmployee: (
    roles: string[],
    stores: string[],
    employeeId: string
  ) => void;
  updateEmployeeStatus: (isActive: boolean, employeeId: string) => void;
  deleteEmployee: (employeeId: string) => void;
  getBankAccounts: (employerId: string) => void;
  addBankAccount: (newAccount: NewBankAccount) => Promise<boolean>;
  deleteBankAccount: (accountId: string) => Promise<boolean>;
};

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get): UserState => ({
        isLoading: false,
        isEmployer: false,
        user: {},
        errors: {},
        employees: [],
        access: {},
        bankAccounts: [],
        reset: () => {
          set({
            isLoading: false,
            isEmployer: false,
            user: {},
            errors: {},
            employees: [],
          });
          sessionStorage.removeItem("userstate");
        },
        updateError: (name) =>
          set((state) => ({
            errors: {
              ...state.errors,
              [name]: "",
            },
          })),
        login: async (email, password, isEmployer) => {
          try {
            set({ isLoading: true });
            const response = await login(email, password, isEmployer);
            const { success, statusCode, data, message } = response;
            set({ isEmployer: isEmployer });
            if (success) {
              set({ user: data, access: getAccess(data?.roles) });
              localStorage.setItem("token", data?.token);
              notification({
                title: "Successful Login",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }
              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return response;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return null;
          }
        },
        addEmployee: async (employee) => {
          try {
            set({ isLoading: true });
            const response = await addEmployee(employee);
            const { success, statusCode, data, message }: any = response;
            if (success) {
              set((state) => ({
                employees: [
                  {
                    ...data,
                  },
                  ...state.employees,
                ],
              }));
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        addEmployer: async (employer) => {
          try {
            set({ isLoading: true });
            const response = await addEmployer(employer);
            const { success, statusCode, data, message }: any = response;
            if (success) {
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        assignEmployee: async (roles, stores, employeeId) => {
          try {
            set({ isLoading: true });
            const response = await assignEmployee(roles, stores, employeeId);

            const { success, statusCode, data, message }: any = response;
            if (success) {
              set((state) => ({
                employees: state.employees.map((employee: any) =>
                  employee.id === employeeId ? { ...data } : employee
                ),
              }));
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        editEmployer: async (employer) => {
          try {
            set({ isLoading: true });
            const response = await editEmployer(employer);

            const { success, statusCode, data, message }: any = response;
            if (success) {
              set((state) => ({
                user: {
                  ...state.user,
                  ...data,
                },
              }));
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        updateEmployeeStatus: async (isActive, employeeId) => {
          try {
            set({ isLoading: true });
            const response = await updateEmployeeStatus(isActive, employeeId);

            const { success, statusCode, data, message }: any = response;
            if (success) {
              set((state) => ({
                employees: state.employees.map((employee: any) =>
                  employee.id === employeeId ? { ...data } : employee
                ),
              }));
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        verifyEmployer: async (email, otp) => {
          try {
            set({ isLoading: true });
            const response = await verifyEmployer(email, otp);

            const { success, statusCode, data, message }: any = response;
            if (success) {
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        resetPassword: async (resetPassword, isEmployer) => {
          try {
            set({ isLoading: true });
            const response = await resetUserPassword(resetPassword, isEmployer);

            const { success, statusCode, data, message }: any = response;
            if (success) {
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        getOtp: async (email) => {
          set({ isLoading: true });
          const response = await getOtp(email);
          const { success, statusCode, data, message } = response;
          if (statusCode === 400) {
            set({ errors: data });
          }
          notification({
            title: "",
            message: message,
            type: success ? "success" : "danger",
          });
          set({ isLoading: false });
        },
        getEmployees: async () => {
          set({ isLoading: true });
          const response = await getEmployees();
          const { success, statusCode, data, message } = response;
          set({ employees: data });
          if (statusCode === 400) {
            set({ errors: data });
            notification({
              title: "",
              message: message,
              type: success ? "success" : "danger",
            });
          }
          set({ isLoading: false });
        },
        deleteEmployee: async (employeeId) => {
          try {
            set({ isLoading: true });
            const response = await deleteEmployee(employeeId);
            const { success, statusCode, data, message }: any = response;
            if (success) {
              set((state) => ({
                employees: state.employees.filter(
                  (employee: any) => employee.id !== employeeId
                ),
              }));
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        getBankAccounts: async (employerId) => {
          set({ isLoading: true });
          const response = await getBankAccounts(employerId);
          const { success, statusCode, data, message } = response;

          set({ bankAccounts: data });

          if (statusCode === 400) {
            set({ errors: data });
            notification({
              title: "",
              message: message,
              type: success ? "success" : "danger",
            });
          }
          set({ isLoading: false });
        },
        addBankAccount: async (newAccount) => {
          try {
            set({ isLoading: true });
            const response = await addBankAccount(newAccount);

            const { success, statusCode, data, message }: any = response;

            if (success) {
              notification({
                title: "",
                message,
                type: "success",
              });

              var existingAccount = get().bankAccounts;

              set({
                bankAccounts:
                  existingAccount?.length > 0
                    ? [{...data}, ...get().bankAccounts]
                    : [{ ...data }],
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
        deleteBankAccount: async (accountId) => {
          try {
            set({ isLoading: true });
            const response = await deleteBankAccount(accountId);
            const { success, statusCode, data, message }: any = response;
            if (success) {
              set((state) => ({
                bankAccounts: state.bankAccounts.filter(
                  (acc) => acc.id !== accountId
                ),
              }));
              notification({
                title: "",
                message,
                type: "success",
              });
            } else {
              if (statusCode === 400) {
                set({ errors: data });
              }

              notification({
                title: "",
                message: message,
                type: "danger",
              });
            }
            set({ isLoading: false });
            return success;
          } catch (err) {
            set({ isLoading: false });
            notification({
              title: "",
              message: "An unknown error occured, please try again later",
              type: "danger",
            });
            return false;
          }
        },
      }),
      {
        name: "userstate",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useUserStore;
