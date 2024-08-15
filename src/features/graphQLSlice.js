import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

const initialState = {
  schema: null,
  schemaLoading: false,
  schemaError: null,
  endpoint: 'https://khala-computation.cyberjungle.io/graphql',
};

const graphQLSlice = createSlice({
  name: 'graphQL',
  initialState,
  reducers: {
    setEndpoint: (state, action) => {
      state.endpoint = action.payload;
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
      });
  },
});

export const { setEndpoint } = graphQLSlice.actions;

export default graphQLSlice.reducer;