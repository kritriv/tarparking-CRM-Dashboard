import { Modal, Button, notification } from "antd";
import { APIService } from "../../apis";

const DeleteSubProductModal = ({ visible, onCancel, record, fetchSubProductData, currentPage }) => {
    const handleDelete = async () => {
        try {
            const response = await APIService.SubProductApi.deleteResource(record.id);

            if (response && response.success) {
                notification.success({
                    message: 'Sub Product Details Deleted',
                    description: `${record.name} has been deleted successfully.`,
                });
                fetchSubProductData(currentPage);
                onCancel();
            } else {
                notification.error({
                    message: 'Error',
                    description: response.message || 'Failed to delete Sub product.',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to delete Sub product. Please try again later.',
            });
        }
    };
    return (
        <Modal
            title="Delete Sub Product"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>Cancel</Button>,
                <Button key="delete" type="primary" danger onClick={handleDelete}>Delete</Button>,
            ]}
        >
            {/* <p>Are you sure you want to delete product <b>{ProductEmail} ?</b></p> */}
            <p>Are you sure you want to delete this Sub product ?</p>
        </Modal>
    );
};

export default DeleteSubProductModal;
