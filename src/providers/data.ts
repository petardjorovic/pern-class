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
      const payload: ListResponse = await response.clone().json();

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

