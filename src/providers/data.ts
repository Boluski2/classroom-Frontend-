import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";
import { createDataProvider, CreateDataProviderOptions, } from "@refinedev/rest";

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL is not defined in environment variables");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Request failed.";

  try {
    const payload = (await response.json()) as { message?: string };
    if (payload.message) {
      message = payload.message;
    }

  } catch (error) {
    // If response is not JSON, keep the default message
  }

 return {
  message,
  statusCode: response.status,
 }

}



// Define the options for the data provider, including custom logic for handling API responses
const options: CreateDataProviderOptions = {
  // Add any custom options here
   getList: {
    // The endpoint can be a string or a function that returns a string based on the resource
        getEndpoint: ({resource}) => resource,



        // The buildQueryParams function allows you to construct the query parameters for the API request based on the pagination and filters provided by the application
        buildQueryParams: async ({ pagination, filters, resource }) => {

          const page = pagination?.currentPage ?? 1;
          const pageSize = pagination?.pageSize ?? 10;

          const params: Record<string, string | number> = { page, limit:pageSize }


          filters?.forEach((filter) => {
            const field = 'field' in filter ? filter.field : ' ';

            const value = String(filter.value)

            if ( resource === 'subjects') {
              if (field === 'department') params.department = value;
              if (field === 'name' || field === 'code' ) params.search = value;
            }
          })

          return params;

        },



// The mapResponse function allows you to transform the API response before it is used by the application
        mapResponse: async (response) => {
          if (!response.ok) throw await buildHttpError(response);
        const payload: ListResponse = await response.clone().json();

          return payload.data ?? [];
        },

        // The getTotalCount function is used to extract the total count of items from the API response, which is useful for pagination
        getTotalCount: async (response) => {
            if (!response.ok) throw await buildHttpError(response);
          const payload: ListResponse = await response.clone().json();
          return payload.pagination?.total ?? payload.data?.length ??  0;
        },
      },

};

// Create the data provider using the base URL and options
const {dataProvider} = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };