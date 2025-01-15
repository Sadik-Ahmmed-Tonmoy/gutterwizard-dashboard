import { baseApi } from '../../api/baseApi';

const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: 'category',
                method: 'GET',
            }),
            providesTags: ['categories'],
        }),
        getSingleCategory: builder.query({
            query: (id) => ({
                url: `categories/${id}`,
                method: 'GET',
            }),
            providesTags: ['categories'],
        }),

        createCategory: builder.mutation({
            query: (data) => {
                return {
                    url: 'category',
                    method: 'POST',
                    body: data,
                };
            },
            invalidatesTags: ['categories'],
        }),
        updateCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `category/${data?.id}`,
                    method: 'PUT',
                    body: data?.data,
                };
            },
            invalidatesTags: ['categories'],
        }),
       activeInactiveCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `categories/${id}/toggle-status`,
                    method: 'POST',
                };
            },
            invalidatesTags: ['categories'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => {
                return {
                    url: `category/${id}`,
                    method: 'DELETE',
                    // body: data?.data,
                };
            },
            invalidatesTags: ['categories'],
        }),
    }),
});

export const { useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useGetSingleCategoryQuery, useActiveInactiveCategoryMutation, useGetCategoriesQuery } = categoriesApi;
