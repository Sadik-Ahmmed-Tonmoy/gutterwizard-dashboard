import account_circle from '@/assets/account_circle.svg';
import calendar_month from '@/assets/calendar_month.svg';
import ImageWithFallBackSystem from '@/components/ui/ImageWithFallBackSystem/ImageWithFallBackSystem';
import { useDeleteBlogMutation } from '@/redux/features/blog/blogApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import dayjs from 'dayjs';
import { StaticImageData } from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { MdDelete, MdDeleteOutline } from 'react-icons/md';
import Swal from 'sweetalert2';

interface BlogCardProps {
    id: string;
    imageSrc: string | StaticImageData;
    author: string | undefined;
    date: string;
    title: string;
    description: string;
    readMoreLink: string;
}

const BlogCard: FC<BlogCardProps> = ({ id, imageSrc, author, date, title, description, readMoreLink }) => {
  const [deleteBlogMutation] = useDeleteBlogMutation()
  const handleDelete = async (id : string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await handleAsyncWithToast(
            async () => {
              // Replace this with your actual mutation or API call
              return deleteBlogMutation(id); // Or your custom mutation to handle the delete operation
            },
            "Deleting...",
            "Deleted successfully!",
            "Deletion failed. Please try again."
          );
  
          if (res?.data?.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              showConfirmButton: false, 
              timer: 1500
            });
          } else {
            Swal.fire({
              title: "Failed!",
              text: "Could not delete the file. Please try again later.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          Swal.fire({
            title: "Error!",
            text: "An unexpected error occurred. Please try again.",
            icon: "error",
          });
        }
      }
    });
  };
  

    return (
        <div className="relative overflow-hidden">
        
                <div onClick={() => handleDelete(id)} className="absolute right-0 top-0 z-10 rounded bg-red-400 bg-opacity-90 p-1 hover:cursor-pointer">
                    <MdDelete size={25} className="text-red-700" />
                </div>
          
            <div className="h-full ">
                <div className="relative h-40 w-full overflow-hidden rounded-md">
                    <ImageWithFallBackSystem imageSrc={imageSrc} alt="Blog Card Image" />
                </div>
                <div className="p-4">
                    <div className="text-gray-light flex items-center space-x-2 text-sm">
                        <span className="flex items-center space-x-1">
                            <div className="h-5 w-5 overflow-hidden rounded-full">
                                <ImageWithFallBackSystem imageSrc={account_circle} />
                            </div>
                            <span className="whitespace-nowrap text-sm font-medium">{author}</span>
                        </span>
                        {date ? (
                            <span className="flex items-center space-x-1">
                                <div className="h-5 w-5 overflow-hidden">
                                    <ImageWithFallBackSystem imageSrc={calendar_month} />
                                </div>
                                <span className="whitespace-nowrap text-sm font-medium">{dayjs(date, 'D MMMM, YYYY').format('D MMM YYYY')}</span>
                            </span>
                        ) : null}
                    </div>
                    <h2 className="mt-2 h-14 overflow-hidden text-xl font-bold text-gray-800">{title?.length > 35 ? <span>{title?.substring(0, 35)}...</span> : <span>{title}</span>}</h2>
                    {/* <p className="text-sm font-medium text-gray-light mt-1 h-14 overflow-hidden">
          {description?.length > 85 ? (
            <span>{description?.substring(0, 85)}...</span>
          ) : (
            <span>{description}</span>
          )}
        </p> */}
                    <div
                        className="ql-editor disable-tailwind"
                        dangerouslySetInnerHTML={{
                            __html: description?.length > 85 ? `${description?.substring(0, 85)}...` : description || '',
                        }}
                    />

                    <Link href={readMoreLink}>
                        <p className="mt-4 flex cursor-pointer items-center gap-1 text-base font-bold text-[#84AA12]">
                            Update
                            <span className="ml-1">
                                <FaArrowRight />
                            </span>
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
