import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching the GraphQL schema
export const fetchGraphQLSchema = createAsyncThunk(
  'graphQL/fetchSchema',
  async (endpoint, { rejectWithValue }) => {
    try {
      const response = await axios.post(endpoint, {
        query: `
          query IntrospectionQuery {
            __schema {
              types {
                name
                kind
                description
                fields {
                  name
                  type {
                    name
                    kind
                    ofType {
                      name
                      kind
                    }
                  }
                }
              }
            }
          }
        `
      });

      return response.data.data.__schema;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// New executeQuery thunk
export const executeQuery = createAsyncThunk(
  'graphQL/executeQuery',
  async ({ endpoint, query }, { rejectWithValue }) => {
    try {
      const response = await axios.post(endpoint, { query });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchQueries = createAsyncThunk(
  'graphQL/fetchQueries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://khala-computation.cyberjungle.io/graphql/queries');
      console.log('Fetched queries:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching queries:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch queries');
    }
  }
);

export const setQueryResult = createAction('graphQL/setQueryResult');

const initialState = {
  schema: null,
  schemaLoading: false,
  schemaError: null,
  endpoint: 'https://khala-computation.cyberjungle.io/graphql',
  queryResult: null,
  queryLoading: false,
  queryError: null,
  queries: [],
  status: 'idle',
  error: null,
};

const graphQLSlice = createSlice({
  name: 'graphQL',
  initialState,
  reducers: {
    setEndpoint: (state, action) => {
      state.endpoint = action.payload;
    },
    [setQueryResult]: (state, action) => {
      state.queryResult = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphQLSchema.pending, (state) => {
        state.schemaLoading = true;
        state.schemaError = null;
      })
      .addCase(fetchGraphQLSchema.fulfilled, (state, action) => {
        state.schemaLoading = false;
        state.schema = action.payload;
      })
      .addCase(fetchGraphQLSchema.rejected, (state, action) => {
        state.schemaLoading = false;
        state.schemaError = action.payload;
      })
      .addCase(executeQuery.pending, (state) => {
        state.queryLoading = true;
        state.queryError = null;
        state.queryResult = null;
      })
      .addCase(executeQuery.fulfilled, (state, action) => {
        state.queryLoading = false;
        state.queryResult = action.payload;
      })
      .addCase(executeQuery.rejected, (state, action) => {
        state.queryLoading = false;
        state.queryError = action.payload;
      })
      .addCase(fetchQueries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.queries = action.payload;
        console.log('Queries stored in state:', state.queries);
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('Failed to fetch queries:', action.payload);
      });
  },
});

export const { setEndpoint } = graphQLSlice.actions;

export default graphQLSlice.reducer;