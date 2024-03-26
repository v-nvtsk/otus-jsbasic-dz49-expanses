import { Store } from ".";
import { AuthData } from "../api/firebase";
import firebase from "../api/firebase/firebase";
import { signIn } from "./authSlice";
import { add as addExpense, read as readExpenses } from "./expenseSlice";

describe("expenseSlice", () => {
  const testAuthData: AuthData = {
    localId: "test_local_id",
    idToken: "test_token",
    refreshToken: "test_refresh_token",
    expiresIn: "3600",
  };

  const testData = {
    id: "test_id-1",
    categoryId: "cat_id-1",
    creationDate: new Date(2024 - 1 - 1).getTime(),
    title: "test",
    amount: 10000,
  };

  const savedData = {
    id: "test_id-1",
    categoryId: "cat_id-1",
    creationDate: new Date(2024 - 1 - 1).getTime(),
    title: "test",
    amount: 10000,
  };

  jest.spyOn(firebase, "signIn").mockResolvedValue(testAuthData);
  jest.spyOn(firebase, "read").mockResolvedValue([]);
  jest.spyOn(firebase, "create").mockResolvedValue(testData.id);

  it("should be authentcated", async () => {
    await Store.dispatch(signIn({ email: "test", password: "test" }));
    expect(firebase.signIn).toHaveBeenCalled();
    expect(Store.getState().auth.isAuthenticated).toBeTruthy();
  });

  it("should add expense", async () => {
    await Store.dispatch(addExpense(testData));
    expect(firebase.create).toHaveBeenCalledWith("expense", testData);
    expect(Store.getState().expenses.items).toEqual([testData]);
  });

  it("should set errorState if add expense fails", async () => {
    jest.spyOn(firebase, "create").mockResolvedValue(undefined);
    await Store.dispatch(addExpense(testData));
    expect(Store.getState().expenses.errorState).toEqual("Expense is not created");
  });

  it("should read all expenses", async () => {
    jest.spyOn(firebase, "read").mockResolvedValue({
      [testData.id as string]: testData,
    });
    await Store.dispatch(readExpenses({}));
    expect(firebase.read).toHaveBeenCalledWith("expense", {});
    expect(Store.getState().expenses.items).toEqual([savedData]);
  });

  it("should set errorState if read expenses fails", async () => {
    jest.spyOn(firebase, "read").mockImplementation(() => {
      throw new Error("error");
    });
    await Store.dispatch(readExpenses({}));
    expect(Store.getState().expenses.errorState).toEqual("error");
  });
});
