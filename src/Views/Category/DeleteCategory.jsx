import { Modal, Button, notification } from "antd";
import { APIService } from "../../apis";

const DeleteCategoryModal = ({ visible, onCancel, record, fetchCategoryData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await APIService.CategoryApi.deleteResource(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Category Details Deleted',
                    description: `${record.name} has been deleted successfully.`,
                });
                fetchCategoryData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete category.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete category. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Category"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete category <b>{CategoryEmail} ?</b></p> */}
            <p>Are you sure you want to delete this category ?</p>
        </Modal>
    );
};

export default DeleteCategoryModal;
