import { zodResolver } from "@hookform/resolvers/zod";
import { useBack, type BaseRecord, type HttpError, useDelete, useList, useNotification, useOne, useUpdate } from "@refinedev/core";
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
import { classSchema } from "@/lib/schema";
import type { ClassDetails, Subject, User } from "@/types";

const ClassesEdit = () => {
  const back = useBack();
  const { id } = useParams();
  const { open: notify } = useNotification();
  const { mutateAsync: updateClass } = useUpdate();
  const { mutateAsync: deleteClass } = useDelete();
  const { query } = useOne<ClassDetails>({ resource: "classes", id: id ?? "" });
  const classDetails = query.data?.data;
  const { query: subjectsQuery } = useList<Subject>({ resource: "subjects", pagination: { pageSize: 100 } });
  const { query: teachersQuery } = useList<User>({ resource: "users", filters: [{ field: "role", operator: "eq", value: "teacher" }], pagination: { pageSize: 100 } });

  const form = useForm<BaseRecord, HttpError, z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "edit",
      id,
      redirect: false,
    },
    defaultValues: {
      name: classDetails?.name ?? "",
      description: classDetails?.description ?? "",
      subjectId: classDetails?.subject?.id ?? 0,
      teacherId: classDetails?.teacher?.id ?? "",
      capacity: classDetails?.capacity ?? 0,
      status: classDetails?.status ?? "active",
      bannerUrl: classDetails?.bannerUrl ?? "",
      bannerCldPubId: classDetails?.bannerCldPubId ?? "",
      inviteCode: classDetails?.inviteCode ?? "",
      schedules: classDetails?.schedules ?? [],
    },
  });

  const { handleSubmit, formState: { isSubmitting }, control } = form;

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    try {
      await updateClass({ resource: "classes", id: id ?? "", values });
      notify?.({ type: "success", message: "Class updated" });
    } catch (error) {
      notify?.({ type: "error", message: "Failed to update class", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  const onDelete = async () => {
    try {
      await deleteClass({ resource: "classes", id: id ?? "" });
      back();
    } catch (error) {
      notify?.({ type: "error", message: "Failed to delete class", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  return (
    <EditView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Edit Class</h1>
      <div className="intro-row">
        <p>Update class information.</p>
        <Button variant="destructive" onClick={onDelete}>Delete Class</Button>
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
                <FormField control={control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
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
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={control} name="subjectId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : ""}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {subjectsQuery.data?.data?.map((subject) => (
                            <SelectItem key={subject.id} value={String(subject.id)}>{subject.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name="teacherId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {teachersQuery.data?.data?.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={control} name="capacity" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl><Input type="number" min={1} onChange={(event) => field.onChange(Number(event.target.value))} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default ClassesEdit;
