import { useMemo, useState } from "react";
import { useCreate, useList, useGetIdentity } from "@refinedev/core";
import { useNavigate } from "react-router";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { ClassDetails, RegistrationCode, User } from "@/types";

const registrationCodeSchema = z.object({
  classId: z.coerce.number().min(1, "Class is required"),
  code: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined))
    .refine(
      (value) => value === undefined || value.length >= 3,
      "Code must be at least 3 characters"
    ),
  expiresAt: z.string().optional(),
  usageLimit: z
    .string()
    .optional()
    .refine(
      (value) => value === undefined || value === "" || Number(value) >= 1,
      "Usage limit must be at least 1"
    ),
});

type RegistrationCodeFormValues = z.infer<typeof registrationCodeSchema>;

const RegistrationCodesPage = () => {
  const navigate = useNavigate();
  const { data: identity } = useGetIdentity<User>();
  const { mutateAsync: createCode, mutation } = useCreate();
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { pageSize: 100 },
  });
  const { query: codesQuery } = useList<RegistrationCode>({
    resource: "registration-codes",
    pagination: { pageSize: 100 },
  });

  const classes = classesQuery.data?.data ?? [];
  const codes = codesQuery.data?.data ?? [];
  const [selectedClass, setSelectedClass] = useState<string>("");

  const form = useForm<RegistrationCodeFormValues>({
    resolver: zodResolver(registrationCodeSchema),
    defaultValues: {
      classId: 0,
      code: "",
      expiresAt: "",
      usageLimit: undefined,
    },
  });

  const onSubmit = async (values: RegistrationCodeFormValues) => {
    if (!identity?.id) return;

    try {
      await createCode({
        resource: "registration-codes",
        values: {
          classId: values.classId,
          code: values.code || undefined,
          expiresAt: values.expiresAt || undefined,
          usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined,
        },
      });
      toast.success("Registration code created.");
      form.reset();
      setSelectedClass("");
      navigate("/registration-codes");
    } catch (error) {
      console.error(error);
      toast.error("Unable to create registration code.");
    }
  };

  const displayCodes = useMemo(() => codes, [codes]);

  if (identity?.role !== "teacher") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          Only teachers may create or manage registration codes.
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateView className="class-view">
      <Breadcrumb />
      <h1 className="page-title">Registration Codes</h1>
      <div className="intro-row">
        <p>Create invite codes for students to register and join specific classes.</p>
      </div>
      <Separator />
      <Card className="class-form-card">
        <CardHeader>
          <CardTitle>Create a Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          setSelectedClass(value);
                        }}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={String(classItem.id)}>
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Leave empty to auto-generate" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires at</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage limit</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="Number of uses" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating code..." : "Create code"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Active Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {displayCodes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registration codes yet.</p>
          ) : (
            <div className="grid gap-3">
              {displayCodes.map((code) => (
                <div key={code.id} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{code.code}</p>
                    <span className="text-xs text-muted-foreground">
                      Uses: {code.usesCount}/{code.usageLimit ?? "∞"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Class: {code.class?.name ?? "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {code.expiresAt ? new Date(code.expiresAt).toLocaleString() : "Never"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </CreateView>
  );
};

export default RegistrationCodesPage;
