//

import {
  useCallback
} from "react";
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery as useRawQuery
} from "react-query";
import {
  usePopup
} from "/client/component/hook/popup";
import {
  useRawMe
} from "/client/component/hook/user";
import {
  AxiosResponseSpec,
  RequestConfig,
  WithFile,
  determineErrorPopupType,
  request as rawRequest,
  requestFile as rawRequestFile
} from "/client/util/request";
import {
  ProcessName,
  RequestData,
  ResponseData,
  SuccessResponseData
} from "/server/controller/internal/type";


export function useQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [ResponseData<N> | null, unknown, UseQueryRestResult<N>] {
  const [, {addErrorPopup}] = usePopup();
  const {data: queryData, error: queryError, ...rest} = useRawQuery<ResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    return response.data;
  });
  return [queryData ?? null, queryError, rest];
}

export function useSuspenseQuery<N extends ProcessName>(name: N, data: RequestData<N>, config: QueryConfig<N> = {}): [SuccessResponseData<N>, UseQueryRestResult<N>] {
  const [, {addErrorPopup}] = usePopup();
  const {data: queryData, ...rest} = useRawQuery<SuccessResponseData<N>>([name, data], async () => {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
    }
    if (response.status !== 200) {
      console.error(response);
      throw new QueryError(response);
    } else {
      return response.data;
    }
  }, {suspense: true, ...config});
  if (queryData === undefined) {
    throw new Error("bug");
  } else {
    return [queryData, rest];
  }
}

export function useRequest(): RequestCallbacks {
  const [, {addErrorPopup}] = usePopup();
  const [, setMe] = useRawMe();
  const request = useCallback(async function <N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequest(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
      if (type === "unauthenticated") {
        setMe(null);
      }
    }
    return response;
  }, [setMe, addErrorPopup]);
  const requestFile = useCallback(async function <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    const response = await rawRequestFile(name, data, config);
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      const type = determineErrorPopupType(response);
      addErrorPopup(type);
      if (type === "unauthenticated") {
        setMe(null);
      }
    }
    return response;
  }, [setMe, addErrorPopup]);
  return {request, requestFile};
}

export function useLogin(): (data: RequestData<"login">, config?: RequestConfig) => Promise<AxiosResponseSpec<"login">> {
  const {request} = useRequest();
  const [, setMe] = useRawMe();
  const login = useCallback(async function (data: RequestData<"login">, config?: RequestConfig): Promise<AxiosResponseSpec<"login">> {
    const response = await request("login", data, config);
    if (response.status === 200) {
      const body = response.data;
      setMe(body.user);
    }
    return response;
  }, [request, setMe]);
  return login;
}

export function useLogout(): (config?: RequestConfig) => Promise<AxiosResponseSpec<"logout">> {
  const {request} = useRequest();
  const [, setMe] = useRawMe();
  const logout = useCallback(async function (config?: RequestConfig): Promise<AxiosResponseSpec<"logout">> {
    const response = await request("logout", {}, config);
    if (response.status === 200) {
      setMe(null);
    }
    return response;
  }, [request, setMe]);
  return logout;
}

type QueryConfig<N extends ProcessName> = RequestConfig & UseQueryOptions<ResponseData<N>>;
type UseQueryRestResult<N extends ProcessName> = Omit<UseQueryResult<ResponseData<N>>, "data" | "error">;
type RequestCallbacks = {
  request: typeof rawRequest,
  requestFile: typeof rawRequestFile
};


export class QueryError extends Error {

  public status: number;
  public data: any;

  public constructor(response: AxiosResponseSpec<ProcessName>) {
    super("query error");
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, QueryError);
    }
    this.name = "QueryError";
    this.status = response.status;
    this.data = response.data;
  }

}