import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ClassDetails, Subject, User } from "@/types"
import { useList } from "@refinedev/core"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState("all")

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: {
      pageSize: 100,
    },
  })

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [
      {
        field: "role",
        operator: "eq",
        value: "teacher",
      },
    ],
    pagination: {
      pageSize: 100,
    },
  })

  const subjects = subjectsQuery.data?.data ?? []
  const teachers = teachersQuery.data?.data ?? []

  const searchFilters = searchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: searchQuery,
        },
      ]
    : []

  const subjectFilters =
    selectedSubject === "all"
      ? []
      : [
          {
            field: "subject",
            operator: "eq" as const,
            value: selectedSubject,
          },
        ]

  const teacherFilters =
    selectedTeacher === "all"
      ? []
      : [
          {
            field: "teacher",
            operator: "eq" as const,
            value: selectedTeacher,
          },
        ]

  const classTable = useTable<ClassDetails>({
    columns: useMemo<ColumnDef<ClassDetails>[]>(
      () => [
        {
          id: "bannerUrl",
          accessorKey: "bannerUrl",
          size: 140,
          header: () => <p className="column-title ml-2">Banner</p>,
          cell: ({ getValue }) => {
            const bannerUrl = getValue<string | undefined>()

            if (!bannerUrl) {
              return <span className="text-muted-foreground">No banner</span>
            }

            return (
              <img
                src={bannerUrl}
                alt="Class banner"
                className="h-14 w-24 rounded-md object-cover"
              />
            )
          },
        },
        {
          id: "name",
          accessorKey: "name",
          size: 220,
          header: () => <p className="column-title">Class Name</p>,
          cell: ({ getValue }) => (
            <span className="text-foreground">{getValue<string>()}</span>
          ),
        },
        {
          id: "status",
          accessorKey: "status",
          size: 140,
          header: () => <p className="column-title">Status</p>,
          cell: ({ getValue }) => {
            const status = getValue<string>()
            return (
              <Badge variant={status === "active" ? "default" : "secondary"}>
                {status}
              </Badge>
            )
          },
        },
        {
          id: "subject",
          accessorFn: (row) => row.subject?.name ?? "",
          size: 180,
          header: () => <p className="column-title">Subject</p>,
          cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        },
        {
          id: "teacher",
          accessorFn: (row) => row.teacher?.name ?? "",
          size: 180,
          header: () => <p className="column-title">Teacher</p>,
          cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        },
        {
          id: "capacity",
          accessorKey: "capacity",
          size: 120,
          header: () => <p className="column-title">Capacity</p>,
          cell: ({ getValue }) => <span>{getValue<number>()}</span>,
        },
      ],
      []
    ),
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [...searchFilters, ...subjectFilters, ...teacherFilters],
      },
      sorters: {
        initial: [
          {
            field: "createdAt",
            order: "desc",
          },
        ],
      },
    },
  })

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by class name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  )
}

export default ClassesList
