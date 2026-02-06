

import { get } from "http";
import { Subject } from "../types";
import { DataProvider, GetListParams, GetListResponse, BaseRecord } from "@refinedev/core";



// Mock subject data for three university courses
const mockSubjects: Subject[] = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    department: "Computer Science",
    description: "A comprehensive introduction to computer science fundamentals, covering algorithms, data structures, and programming paradigms. Students will learn problem-solving techniques and computational thinking.",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    name: "Calculus II",
    code: "MATH201",
    department: "Mathematics",
    description: "Advanced calculus course focusing on integration techniques, differential equations, and infinite series. This course builds on calculus fundamentals and prepares students for advanced mathematics and physics.",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 3,
    name: "Principles of Biology",
    code: "BIO150",
    department: "Biology",
    description: "An introductory biology course exploring the structure and function of living organisms, cellular biology, genetics, and evolution. Students engage with both theoretical concepts and hands-on laboratory experiments.",
    createdAt: "2024-01-15T10:00:00Z",
  },
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord  = BaseRecord>( {resource} :
   GetListParams): Promise<GetListResponse<TData>> => {
    // Implement your logic to fetch a list of resources
    if ( resource !== "subjects" ) return {
      data: [] as TData[],
      total: 0,
    }
    return {
      data: mockSubjects as unknown as TData[],
      total: mockSubjects.length,
    }
  },

  getOne: async () =>{ throw new Error ("Method not implemented.") },
  create : async () =>{ throw new Error ("Method not implemented.") },
  update : async () =>{ throw new Error ("Method not implemented.") },
  deleteOne : async () =>{ throw new Error ("Method not implemented.") },
  
  getApiUrl : () => { throw new Error ("Method not implemented.") },
  custom : async () =>{ throw new Error ("Method not implemented.") },
}