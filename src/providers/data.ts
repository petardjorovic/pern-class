// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// import {BaseRecord, DataProvider, GetListParams, GetListResponse} from "@refinedev/core";
// import { MOCK_SUBJECTS } from "../constants/mock-data.ts";
// // export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
// //   apiURL: API_URL,
// // });
// export const { kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });
//
//
//
// export const dataProvider : DataProvider = {
//   getList: async <TData extends BaseRecord = BaseRecord>({resource} : GetListParams) : Promise<GetListResponse<TData>> => {
//     if(resource !== "subjects") {
//       return { data: [] as TData[], total : 0 }
//     }
//
//     return {
//         data: MOCK_SUBJECTS as unknown as TData[],
//         total: MOCK_SUBJECTS.length
//     }
// },
//   getOne: async () => { throw new Error("THis function is not present in mock") },
//   create: async () => { throw new Error("THis function is not present in mock") },
//   update: async () => { throw new Error("THis function is not present in mock") },
//   deleteOne: async () => { throw new Error("THis function is not present in mock") },
//   getApiUrl: () => "",
// }

import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";
import {BACKEND_BASE_URL} from "@/constants";
import {ListResponse} from "@/types";

const options : CreateDataProviderOptions = {
  getList: {
    // 1. Define the endpoint (optional - defaults to resource name)
    getEndpoint: ({resource}) => resource, // // "posts" → "/posts"

    // 2. Transform Refine's parameters into your API's query format
    buildQueryParams: async ({resource,pagination, filters}) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = {page, limit: pageSize};

      filters?.forEach(filter => {
        const field = 'field' in filter ? filter.field : '';
        const value = String(filter.value);

        if(resource === 'subjects'){
          if(field === 'department') params.department = value;
          if(field === 'name' || field === 'code') params.search = value;
        }
      })

      return params;
    },

    // 3. Extract the data array from an API response
    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.data ?? [];
    },

    // 4. Extract the total count for pagination
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    }
  }
}

const {dataProvider} = createDataProvider(BACKEND_BASE_URL,options);

export {dataProvider};

