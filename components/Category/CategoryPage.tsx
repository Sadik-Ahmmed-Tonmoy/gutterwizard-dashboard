'use client';
import React, { useState } from 'react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useActiveInactiveCategoryMutation } from '@/redux/features/categories/categoriesApi';
// import MyLoading from '../ui/MyLoading';
import Swal from 'sweetalert2';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';

const CategoryPage = () => {
    const { data: getCategoriesQuery, isLoading, isFetching } = useGetCategoriesQuery(undefined);
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [activeInactiveCategoryMutation] = useActiveInactiveCategoryMutation();
    const [formData, setFormData] = useState({ _id: null, name: '' });

    // Create or Update Category
    const handleSave = async () => {
        if (formData._id) {
            try {
                const res = await handleAsyncWithToast(async () => {
                    return updateCategory({
                        id: formData._id,
                        data: { name: formData.name },
                    });
                }, 'Loading...');
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        } else {
            try {
                const res = await handleAsyncWithToast(async () => {
                    return createCategory({ name: formData.name });
                }, 'Loading...');
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
        setFormData({ _id: null, name: '' });
    };

    const handleDelete = async (id: string) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await handleAsyncWithToast(
                        async () => {
                            return deleteCategory(id);
                        },
                        'Deleting...',
                        'Deleted successfully!',
                        'Deletion failed. Please try again.'
                    );

                    if (res?.data?.success) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'Your file has been deleted.',
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        Swal.fire({
                            title: 'Failed!',
                            text: 'Could not delete the file. Please try again later.',
                            icon: 'error',
                        });
                    }
                } catch (error) {
                    console.error('Error deleting file:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'An unexpected error occurred. Please try again.',
                        icon: 'error',
                    });
                }
            }
        });
    };

    // Open Edit Form
    const handleEdit = (category: any) => {
        console.log(category);
        setFormData(category);
        window.scrollTo(0, 0);
    };

    const handleActiveInactive = async (id: string) => {
        try {
            const res = await handleAsyncWithToast(async () => {
                return activeInactiveCategoryMutation(id);
            }, 'Loading...');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (isLoading) {
        return <div className="">Loading...</div>;
    }

    return (
        <div className="md:p-4">
            <h1 className="mb-4 text-2xl font-bold">Category Management</h1>

            {/* Form for Create/Update */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mb-2 w-full rounded border border-gray-300 p-2"
                />
                <button onClick={handleSave} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    {formData._id ? 'Update' : 'Create'}
                </button>
            </div>

            {/* Responsive Table */}
            {isFetching ? (
                <div className="">Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">#</th>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Created At</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCategoriesQuery?.data?.categories?.map((category: any, index: number) => (
                                <tr key={category.id}>
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{new Date(category.createdAt).toLocaleString()}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex flex-wrap gap-2">
                                            {/* {category?.active_status ? (
                                                <button onClick={() => handleActiveInactive(category.id)} className="rounded-md bg-blue-500 px-4 py-2 text-white">
                                                    Active
                                                </button>
                                            ) : (
                                                <button onClick={() => handleActiveInactive(category.id)} className="rounded-md bg-red-500 px-3 py-2 text-white">
                                                    Inactive
                                                </button>
                                            )} */}
                                            <button onClick={() => handleEdit(category)} className=" rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(category._id)} className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
