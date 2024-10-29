"use client";
import Button from "@/components/buttons/Button";

import AlertModal from "@/components/modal/variants/alertModal";
import ConfirmModal from "@/components/modal/variants/confirmModal";
import SuccessModal from "@/components/modal/variants/successModal";

export default function ModalPage() {
  return (
    <>
      <section>
        <div className="flex flex-wrap justify-center gap-4 h-screen pt-24">
          <AlertModal>
            {({ openModal }) => (
              <Button variant="red" onClick={openModal} className="h-10">
                Alert Modal
              </Button>
            )}
          </AlertModal>
          <ConfirmModal>
            {({ openModal }) => (
              <Button variant="yellow" onClick={openModal} className="h-10">
                Confirm Modal
              </Button>
            )}
          </ConfirmModal>
          <SuccessModal>
            {({ openModal }) => (
              <Button variant="green" onClick={openModal} className="h-10">
                Success Modal
              </Button>
            )}
          </SuccessModal>
        </div>
      </section>
    </>
  );
}
