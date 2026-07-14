import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, type BaseRecord, type HttpError, useDelete, useNotification, useList, useOne, useUpdate } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { useParams } from "react-router";
import * as z from "zod";

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Department, Subject } from "@/types";

const subjectSchema = z.object({
  departmentId: z.coerce.number().min(1, "Department is required"),
  name: z.string().min(3, "Subject name is required"),
  code: z.string().min(3, "Subject code is required"),
  description: z.string().min(5, "Description is required"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

const SubjectsEdit = () => {
  const back = useBack();
  const { id } = useParams();
  const { open: notify } = useNotification();
  const { mutateAsync: updateSubject } = useUpdate();
  const { mutateAsync: deleteSubject } = useDelete();
  const { query } = useOne<Subject>({ resource: "subjects", id: id ?? "" });
  const subject = query.data?.data;
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100 },
  });

  const form = useForm<BaseRecord, HttpError, SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "edit",
      id,
      redirect: false,
    },
    defaultValues: {
      departmentId: 0,
      name: subject?.name ?? "",
      code: subject?.code ?? "",
      description: subject?.description ?? "",
    },
  });

  const { handleSubmit, formState: { isSubmitting }, control } = form;

  const onSubmit = async (values: SubjectFormValues) => {
    try {
      await updateSubject({ resource: "subjects", id: id ?? "", values });
      notify?.({ type: "success", message: "Subject updated" });
    } catch (error) {
      notify?.({ type: "error", message: "Failed to update subject", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  const onDelete = async () => {
    try {
      await deleteSubject({ resource: "subjects", id: id ?? "" });
      back();
    } catch (error) {
      notify?.({ type: "error", message: "Failed to delete subject", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  return (
    <EditView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Edit Subject</h1>
      <div className="intro-row">
        <p>Update subject details.</p>
        <Button variant="destructive" onClick={onDelete}>Delete Subject</Button>
      </div>
      <Separator />
      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader>
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">Update form</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={control} name="departmentId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : ""}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departmentsQuery.data?.data?.map((department) => (
                          <SelectItem key={department.id} value={String(department.id)}>{department.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name="code" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea className="min-h-28" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default SubjectsEdit;
