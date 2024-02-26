import { Modal, Button, notification } from "antd";
import { CompanyServicesAPI } from "../../apis";

const DeleteCompanyModal = ({ visible, onCancel, record, fetchCompanyData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await CompanyServicesAPI.deleteCompany(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Company Details Deleted',
                    description: `${record.name} has been deleted successfully.`,
                });
                fetchCompanyData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete company.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete company. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Company"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete company <b>{CompanyEmail} ?</b></p> */}
            <p>Are you sure you want to delete this company ?</p>
        </Modal>
    );
};

export default DeleteCompanyModal;
