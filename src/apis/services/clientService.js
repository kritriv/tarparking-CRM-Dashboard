import apiClient from '../apiClient';

export const ClientApi = {
    Create: '/api/v1/client/add',
    List: '/api/v1/clients',
    Read: '/api/v1/client',
    Delete: '/api/v1/client',
    Update: '/api/v1/client',
};

const createClient = (data) => apiClient.post({ url: ClientApi.Create, data });
const listClient = (page, size) => apiClient.get({ url: `${ClientApi.List}?page=${page}&size=${size}` });
const readClient = (id) => apiClient.get({ url: `${ClientApi.Read}/${id}` });
const deleteClient = (id) => apiClient.delete({ url: `${ClientApi.Delete}/${id}` });
const updateClient = (id, data) => apiClient.put({ url: `${ClientApi.Update}/${id}`, data });

export {
    createClient,
    listClient,
    readClient,
    deleteClient,
    updateClient,
};
