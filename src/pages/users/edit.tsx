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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/types";

const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "teacher", "student"]),
  emailVerified: z.boolean().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

const UsersEdit = () => {
  const back = useBack();
  const { id } = useParams();
  const { open: notify } = useNotification();
  const { mutateAsync: updateUser } = useUpdate();
  const { mutateAsync: deleteUser } = useDelete();

  const { query } = useOne<User>({ resource: "users", id: id ?? "" });
  const user = query.data?.data;

  const form = useForm<BaseRecord, HttpError, UserFormValues>({
    resolver: zodResolver(userSchema),
    refineCoreProps: {
      resource: "users",
      action: "edit",
      id: id,
      redirect: false,
    },
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "student",
      emailVerified: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = form;

  const onSubmit = async (values: UserFormValues) => {
    try {
      await updateUser({ resource: "users", id: id ?? "", values });
      notify?.({ type: "success", message: "User updated" });
    } catch (error) {
      notify?.({ type: "error", message: "Failed to update user", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  const onDelete = async () => {
    try {
      await deleteUser({ resource: "users", id: id ?? "" });
      back();
    } catch (error) {
      notify?.({ type: "error", message: "Failed to delete user", description: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  return (
    <EditView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Edit User</h1>
      <div className="intro-row">
        <p>Update the selected account details.</p>
        <Button variant="destructive" onClick={onDelete}>
          Delete User
        </Button>
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
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="emailVerified"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <FormLabel>Email Verified</FormLabel>
                        <p className="text-sm text-muted-foreground">Set verification state.</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default UsersEdit;
