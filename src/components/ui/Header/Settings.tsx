"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CardContent } from "@/components/ui/card";
import { DialogHeader, DialogTitle } from "../dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type SettingValue = string | boolean | string[];
export type SettingType =
    | "checkbox"
    | "text"
    | "password"
    | "email"
    | "number"
    | "textarea"
    | "select"
    | "radio";

interface BaseSetting {
    label: string;
    description?: string;
    value: SettingValue;
    default: SettingValue;
    onChange: (value: SettingValue) => void;
}

interface CheckboxSetting extends BaseSetting {
    type: "checkbox";
    value: boolean;
    default: boolean;
}

interface TextSetting extends BaseSetting {
    type: "text" | "password" | "email" | "number";
    value: string;
    default: string;
}

interface TextareaSetting extends BaseSetting {
    type: "textarea";
    value: string;
    default: string;
}

interface SelectSetting extends BaseSetting {
    type: "select";
    options: { label: string; value: string }[];
    value: string;
    default: string;
}

interface RadioSetting extends BaseSetting {
    type: "radio";
    options: { label: string; value: string }[];
    value: string;
    default: string;
}

export type Setting =
    | CheckboxSetting
    | TextSetting
    | TextareaSetting
    | SelectSetting
    | RadioSetting;

export interface SettingsMap {
    [key: string]: Setting;
}

function getSettingValue(setting: Setting): SettingValue {
    switch (setting.type) {
        case "checkbox":
            return (
                (setting as CheckboxSetting).value ??
                (setting as CheckboxSetting).default
            );
        case "text":
        case "password":
        case "email":
        case "number":
        case "textarea":
        case "select":
        case "radio":
            return (
                (setting as BaseSetting).value ??
                (setting as BaseSetting).default
            );
        default:
            const _exhaustiveCheck: never = setting;
            return _exhaustiveCheck as never;
    }
}

function SettingsForm({ settingsMap }: { settingsMap: SettingsMap }) {
    return (
        <>
            <DialogHeader className="border-b pb-4">
                <DialogTitle>Settings</DialogTitle>
            </DialogHeader>
            <CardContent className="space-y-6">
                {Object.entries(settingsMap).map(([key, setting]) => (
                    <div key={key} className="flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <Label
                                    htmlFor={key}
                                    className="text-sm font-medium"
                                >
                                    {setting.label}
                                </Label>
                                {setting.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {setting.description}
                                    </p>
                                )}
                            </div>
                            {renderInput(key, setting)}
                        </div>
                    </div>
                ))}
            </CardContent>
        </>
    );
}

function renderInput(key: string, setting: Setting) {
    switch (setting.type) {
        case "checkbox":
            return (
                <Switch
                    id={key}
                    checked={getSettingValue(setting) as boolean}
                    onCheckedChange={(value) => {
                        setting.onChange(value);
                    }}
                />
            );
        case "text":
        case "password":
        case "email":
        case "number":
            return (
                <Input
                    id={key}
                    type={setting.type}
                    value={getSettingValue(setting) as string}
                    onChange={(e) => {
                        setting.onChange(e.target.value);
                    }}
                    className="max-w-xs"
                />
            );
        case "textarea":
            return (
                <Textarea
                    id={key}
                    value={getSettingValue(setting) as string}
                    onChange={(e: {
                        target: { value: string | boolean | string[] };
                    }) => {
                        setting.onChange(e.target.value);
                    }}
                    className="max-w-xs"
                />
            );
        case "select":
            return (
                <Select
                    value={getSettingValue(setting) as string}
                    onValueChange={(value) => {
                        setting.onChange(value);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        {setting.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case "radio":
            return (
                <RadioGroup
                    value={getSettingValue(setting) as string}
                    onValueChange={(value) => {
                        setting.onChange(value);
                    }}
                    className="flex flex-col space-y-1"
                >
                    {setting.options.map((option) => (
                        <div
                            key={option.value}
                            className="flex items-center space-x-2"
                        >
                            <RadioGroupItem
                                value={option.value}
                                id={`${key}-${option.value}`}
                            />
                            <Label htmlFor={`${key}-${option.value}`}>
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            );
        default:
            return null;
    }
}

export default SettingsForm;
