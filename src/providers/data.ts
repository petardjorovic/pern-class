import {createDataProvider, CreateDataProviderOptions} from "@refinedev/rest";
import {BACKEND_BASE_URL} from "@/constants";
import {CreateResponse, GetOneResponse, ListResponse} from "@/types";
import {HttpError} from "@refinedev/core";

const buildHttpError = async (response: Response): Promise<HttpError> => {
    let message = 'Request failed';
    try {
        const payload = (await response.json()) as { message?: string };

        if(payload?.message) message = payload.message;
    } catch {
      
    }

    return {
      message,
      statusCode: response.status,
    }
}

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

        if(resource === 'classes'){
            if(field === 'name') params.search = value;
            if(field === 'subject') params.subject = value;
            if(field === 'teacher') params.teacher = value;
        }
      })

      return params;
    },

    // 3. Extract the data array from an API response
    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },

    // 4. Extract the total count for pagination
    getTotalCount: async (response) => {
      if(!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    }
  },

    create: {
        getEndpoint: ({resource}) => resource,

        buildBodyParams: async ({variables}) => variables,

        mapResponse: async (response) => {
            if(!response.ok) throw await buildHttpError(response);
            const json: CreateResponse = await response.json();


            return json.data ?? {};
        }
    },

    getOne: {
        getEndpoint: ({resource, id}) => `${resource}/${id}`,

        mapResponse: async (response) => {
            if(!response.ok) throw await buildHttpError(response);
            const json: GetOneResponse = await response.json();

            if (!json.data) throw { message: 'No data returned', statusCode: 404 };
            return json.data;
        }
    }
}

const {dataProvider} = createDataProvider(BACKEND_BASE_URL,options);

export {dataProvider};

