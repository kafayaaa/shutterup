import { useDispatch, useSelector } from "react-redux";
import Dialog from "./Dialog";
import { RootState } from "@/store";
import { toggleModal } from "@/store/slices/uiSlice";
interface Props {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function DialogForm({ trigger, children, onSubmit }: Props) {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.ui.isModalOpen);

  const handleOpen = () => {
    dispatch(toggleModal());
  };
  return (
    <div>
      <button onClick={handleOpen}>{trigger}</button>
      {isOpen && (
        <Dialog onClick={handleOpen} onSubmit={onSubmit} title="Tambah Produk">
          {children}
        </Dialog>
      )}
    </div>
  );
}
