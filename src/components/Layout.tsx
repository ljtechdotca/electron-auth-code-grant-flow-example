import { FC, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useStore } from "../hooks/useStore";
import { KeyIcon, LoginIcon, TagIcon } from "./icons/Icons";
import styles from "./Layout.module.scss";

export const Layout: FC = () => {
  const { store, updateStore, onStoreEvent } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onTwitchAppSubmit({ clientId, clientSecret }: FieldValues) {
    updateStore({ isSubmitting: true, error: null });
    window.Main.sendLogin({ type: "twitch", clientId, clientSecret });
  }

  useEffect(() => {
    window.Main.onStore(onStoreEvent);
  }, []);

  return (
    <div className={styles.root}>
      {/* <pre>
        <code>{JSON.stringify(store, null, 4)}</code>
      </pre> */}
      <form onSubmit={handleSubmit(onTwitchAppSubmit)}>
        <div className="status">
          {store.isSubmitting ? (
            <span>
              <div className={styles.spinner}>
                <div></div>
              </div>
              Logging in
            </span>
          ) : (
            <span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="4"
                  cy="4"
                  r="4"
                  fill={store.isLoggedIn ? "var(--green)" : "var(--red)"}
                />
              </svg>{" "}
              Logged {store.isLoggedIn ? "in" : "out"}
            </span>
          )}
        </div>
        <label htmlFor="clientId">
          <span>
            <TagIcon width={14} height={14} /> Client ID
          </span>
          <input
            defaultValue="defaultValue"
            id="clientId"
            type="text"
            {...register("clientId", { required: true })}
          />
          {errors.exampleRequired && <span>Client ID is required</span>}
        </label>
        <label htmlFor="clientSecret">
          <span>
            <KeyIcon width={14} height={14} /> Client Secret
          </span>
          <input
            defaultValue="defaultValue"
            id="clientSecret"
            type="password"
            {...register("clientSecret", { required: true })}
          />
          {errors.exampleRequired && <span>Client secret is required</span>}
        </label>
        <div>
          {store.isSubmitting ? (
            <div>Please wait...</div>
          ) : (
            <button type="submit">
              <span>
                <LoginIcon width={16} height={16} /> Login
              </span>
            </button>
          )}
        </div>
        {store.error && <div className={styles.error}>{store.error}</div>}
      </form>
    </div>
  );
};
