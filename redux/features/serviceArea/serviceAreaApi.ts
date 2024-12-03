
import { baseApi } from "../../api/baseApi";


const serviceAreaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewServiceAreas: builder.mutation({
      query: () => ({
        url: "service-area/add",
        method: "POST",
      }),
      invalidatesTags: ["serviceArea"],
    }),
    getAllServiceAreas: builder.query({
      query: () => ({
        url: "service-area",
        method: "GET",
      }),
      providesTags: ["serviceArea"],
    }),
    updateServiceArea: builder.mutation({
        query: (body) => {
          return {
            url: `service-area/${body?.id}`,
            method: "PUT",
            body: body?.data,
          };
        },
        invalidatesTags: ["serviceArea"],
      }),
  }),
});

export const {
  useAddNewServiceAreasMutation,
useGetAllServiceAreasQuery,
  useUpdateServiceAreaMutation,
} = serviceAreaApi;
