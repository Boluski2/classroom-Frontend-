import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, type BaseRecord, type HttpError, useDelete, useNotification, useOne, useUpdate } from "@refinedev/core";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Department } from "@/types";

const departmentSchema = z.object({
  code: z.string().min(2, "Department code is required"),
  name: z.string().min(3, "Department name is required"),
  description: z.string().min(5, "Description is required"),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const DepartmentsEdit = () => {
  const back = useBack();
  const { id } = useParams();
  const { open: notify } = useNotification();
  const { mutateAsync: updateDepartment } = useUpdate();
  const { mutateAsync: deleteDepartment } = useDelete();
  const { query } = useOne<Department>({ resource: "departments", id: id ?? "" });
  const department = query.data?.data as Department | undefined;

  const form = useForm<BaseRecord, HttpError, DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    refineCoreProps: {
      resource: "departments",
      action: "edit",
      id,
      redirect: false,
    },
    defaultValues: {
      code: department?.id ? String(department.id) : "",
      name: department?.name ?? "",
      description: department?.description ?? "",
    },
  });

  const { handleSubmit, formState: { isSubmitting }, control } = form;

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      await updateDepartment({ resource: "departments", id: id ?? "", values });
      notify?.({ type: "success", message: "Department updated" });
    } catch (error) {
      notify?.({ type: "error", message: "Failed to update department", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  const onDelete = async () => {
    try {
      await deleteDepartment({ resource: "departments", id: id ?? "" });
      back();
    } catch (error) {
      notify?.({ type: "error", message: "Failed to delete department", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  return (
    <EditView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Edit Department</h1>
      <div className="intro-row">
        <p>Update department details.</p>
        <Button variant="destructive" onClick={onDelete}>Delete Department</Button>
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
                <FormField control={control} name="code" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
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

export default DepartmentsEdit;
