/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/style-prop-object */
import { useEffect, useState } from "react";
import SimpleTable from "core/components/table/SimpleTable";
import TableRowData from "core/components/table/TableRowData";
import { expandRow, getDate } from "core/services/helpers";
import Button from "core/components/button/Button";
import ActionRowData from "core/components/table/ActionRowData";
import SubHeader from "core/components/subHeader";
import Card from "core/components/card";
import Modal from "core/components/modal/Modal";
import InputField from "core/components/fields/InputField";
import { FiDelete } from "react-icons/fi";
import useUserStore from "core/services/stores/useUserStore";

const BankAccounts = () => {
  const [expandedRows, setExpandedRows]: any = useState([]);
  const [, setExpandState] = useState({});

  const user = useUserStore((state) => state.user);
  const access = useUserStore((state) => state.access);

  const errors = useUserStore((store) => store.errors);
  const updateError = useUserStore((store) => store.updateError);

  const bankAccounts = useUserStore((store) => store.bankAccounts);
  const getBankAccountsAction = useUserStore((store) => store.getBankAccounts);
  const deleteBankAccountAction = useUserStore(
    (store) => store.deleteBankAccount
  );
  const addBankAccountAction = useUserStore((store) => store.addBankAccount);

  const [bankForm, setBankForm] = useState<NewBankAccount>({
    accountName: "",
    accountNumber: "",
    bank: "",
  });

  const [openAddForm, setOpenAddForm] = useState(false);

  const onFormChange = (e: any, form: string = "add") => {
    const { name, value } = e.target;
    switch (form) {
      case "add":
        setBankForm({
          ...bankForm,
          [name]: value,
        });
        break;
      case "update":
        break;
      default:
        break;
    }
  };

  const addBank = async (e: any) => {
    e.preventDefault();
    var status: any = await addBankAccountAction({ ...bankForm });
    if (status) {
      setBankForm({
        accountName: "",
        accountNumber: "",
        bank: "",
      });
      setOpenAddForm(false);
    }
  };

  const deleteBankAccount = async (e: any, accountId: string) => {
    const response = window.confirm(
      // eslint-disable-next-line quotes
      "Click 'OK' to delete this category'."
    );

    if (!response) return;
    await deleteBankAccountAction(accountId);
  };

  const handleExpandRow = async (event: any, id: string) => {
    var newRows = await expandRow(id, expandedRows);
    setExpandState(newRows?.obj);
    setExpandedRows(newRows?.newExpandedRows);
  };

  useEffect(() => {
    getBankAccountsAction(user?.employerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-3">
      <Card extra={"w-full h-full mx-4 px-6 pb-6 sm:overflow-x-auto"}>
        <SubHeader
          title="Bank Accounts"
          action="Add Account"
          showAction={access?.category?.includes("WRITE")}
          actionFunc={() => setOpenAddForm(true)}
        />
        <SimpleTable
          headers={[
            "Bank",
            "Account Number",
            "Account Name",
            "Added By",
            "Updated By",
            "Date Added",
            "Last Updated",
            "Actions",
          ]}
        >
          {bankAccounts != null && bankAccounts?.length > 0 ? (
            bankAccounts.map((account) => (
              <>
                <tr key={account?.id}>
                  <TableRowData value={account?.bank} />
                  <TableRowData value={account?.accountNumber} />
                  <TableRowData value={account?.accountName} />
                  <TableRowData value={account?.addedBy} />
                  <TableRowData value={account?.updatedBy} />
                  <TableRowData value={getDate(account?.dateAdded)} />
                  <TableRowData value={getDate(account?.lastUpdated)} />
                  <ActionRowData>
                    {access?.category?.includes("DELETE") && (
                      <Button
                        style="flex gap-1 justify-items-center items-center bg-red-500 hover:bg-red-600 dark:text-white-300"
                        onClick={(e: any) => {
                          deleteBankAccount(e, account?.id);
                        }}
                      >
                        <FiDelete />
                        <span className="text-xs">Delete</span>
                      </Button>
                    )}
                  </ActionRowData>
                </tr>
              </>
            ))
          ) : (
            <tr>
              <TableRowData colSpan={8} value="No bank account yet" />
            </tr>
          )}
        </SimpleTable>
      </Card>

      {openAddForm && (
        <Modal
          styling="w-full md:w-2/3 lg:w-1/4 p-5"
          onClose={() => {
            setOpenAddForm(false);
          }}
        >
          <form onSubmit={(e) => addBank(e)}>
            <p className="mb-5 font-bold dark:text-white">
              Add New Bank Account
            </p>

            <InputField
              variant="auth"
              extra="mb-3"
              label="Bank*"
              id="bank"
              type="text"
              name="bank"
              value={bankForm?.bank}
              onChange={(e: any) => onFormChange(e, "add")}
              onFocus={() => {
                if (errors?.Bank && errors?.Bank?.length > 0) {
                  updateError("Bank");
                }
              }}
              error={errors?.Bank}
            />

            <InputField
              variant="auth"
              extra="mb-3"
              label="Account Name*"
              id="accountName"
              type="text"
              name="accountName"
              value={bankForm?.accountName}
              onChange={(e: any) => onFormChange(e, "add")}
              onFocus={() => {
                if (errors?.AccountName && errors?.AccountName?.length > 0) {
                  updateError("AccountName");
                }
              }}
              error={errors?.AccountName}
            />

            <InputField
              variant="auth"
              extra="mb-3"
              label="Account Number*"
              id="accountNumber"
              type="text"
              name="accountNumber"
              value={bankForm?.accountNumber}
              onChange={(e: any) => onFormChange(e, "add")}
              onFocus={() => {
                if (
                  errors?.AccountNumber &&
                  errors?.AccountNumber?.length > 0
                ) {
                  updateError("AccountNumber");
                }
              }}
              error={errors?.AccountNumber}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setOpenAddForm(false)}
                style="linear mb-5 mt-3 w-full rounded-md bg-red-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700 dark:bg-red-400 dark:text-white dark:hover:bg-red-300 dark:active:bg-red-200 text-xs"
              >
                Cancel
              </Button>
              <button className="linear mb-5 mt-3 w-full rounded-md bg-green-500 py-[12px] text-base text-xs font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200">
                Add Bank Account
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BankAccounts;
