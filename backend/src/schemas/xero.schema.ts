import { Amount } from "xero-node/dist/gen/model/projects/amount";
import { ChargeType } from "xero-node/dist/gen/model/projects/chargeType";
import { Task } from "xero-node/dist/gen/model/projects/task";
import { number } from "zod"

export type XeroContactPerson = {

}

export type XeroContactGroup = {

}

export type XeroContactAddress = {
    addressType: string;
    city: string;
    region: string;
    postCode: string;
    country: string;
    attentionTo: string;
}

export type XeroContactPhone = {
    phoneType: string;
    phoneNumber: string;
    phoneAreaCode: string;
    phoneCountryCode: string;
}

export type XeroContactBalance = {
    accountsReceivable: {
        outstanding: number;
        overdue: number;
    };
    accountsPayable: {
        outstanding: number;
        overdue: number;
    };
}

export type XeroContact = {
    contactID: string;
    contactNumber: string;
    contactStatus: string;
    name: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    contactPersons: XeroContactPerson[];
    bankAccountDetails: string;
    addresses: XeroContactAddress[];
    phones: XeroContactPhone[];
    isSupplier: boolean;
    isCustomer: boolean;
    updatedDateUTC: string;
    contactGroups: XeroContactGroup[];
    balances: XeroContactBalance;
    hasAttachments: boolean;
    hasValidationErrors: boolean;
}

export type CurrencyValue = {
    currency: string;
    value: string;
}

export type XeroProjects = {
    items: [XeroProject],
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        itemCount: number;
    }
}

export type XeroProjectTasks = {
    items: [XeroProjectTask],
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        itemCount: number;
    }
}

export type XeroProjectTask = {
    /**
    * Identifier of the task.
    */
    taskId?: string;
    /**
    * Name of the task.
    */
    name?: string;
    rate?: Amount;
    chargeType?: ChargeType;
    /**
    * An estimated time to perform the task
    */
    estimateMinutes?: number;
    /**
    * Identifier of the project task belongs to.
    */
    projectId?: string;
    /**
    * Total minutes which have been logged against the task. Logged by assigning a time entry to a task
    */
    totalMinutes?: number;
    totalAmount?: Amount;
    /**
    * Minutes on this task which have been invoiced.
    */
    minutesInvoiced?: number;
    /**
    * Minutes on this task which have not been invoiced.
    */
    minutesToBeInvoiced?: number;
    /**
    * Minutes logged against this task if its charge type is `FIXED`.
    */
    fixedMinutes?: number;
    /**
    * Minutes logged against this task if its charge type is `NON_CHARGEABLE`.
    */
    nonChargeableMinutes?: number;
    amountToBeInvoiced?: Amount;
    amountInvoiced?: Amount;
    /**
    * Status of the task. When a task of ChargeType is `FIXED` and the rate amount is invoiced the status will be set to `INVOICED` and can\'t be modified. A task with ChargeType of `TIME` or `NON_CHARGEABLE` cannot have a status of `INVOICED`. A `LOCKED` state indicates that the task is currently changing state (for example being invoiced) and can\'t be modified.
    */
    status?: Task.StatusEnum;
}

export type XeroProject = {
    projectId: string;
    contactId: string;
    name: string;
    currencyCode: string;
    minutesLogged: number;
    totalTaskAmount: CurrencyValue;
    totalExpenseAmount: CurrencyValue;
    minutesToBeInvoiced: number;
    tasksAmountToBeInvoiced: CurrencyValue;
    taskAmountInvoiced: CurrencyValue;
    expenseAmountToBeInvoiced: CurrencyValue;
    expenseAmountInvoiced: CurrencyValue;
    projectAmountInvoiced: CurrencyValue;
    deposit: CurrencyValue;
    depositApplied: CurrencyValue;
    creditNoteAmount: CurrencyValue;
    deadlineUtc: string;
    totalInvoiced: CurrencyValue;
    totalToBeInvoiced: CurrencyValue;
    estimate: CurrencyValue;
    status: string;

}

export type GetXeroContactsInput = {
    query: {
        id: string | undefined;
        name: string | undefined;
        isCustomer: boolean | undefined;
    }
}

export type GetXeroProjectsInput = {
    query: {
        name: string | undefined;
        projectId: string | undefined;
        contactId: string | undefined;
        page: number | undefined;
        pageSize: number | undefined;
    }
}

export type CreateXeroProjectTimeInput = {
    body: {
        userId: string;
        taskId: string;
        dateUtc?: Date;
        duration: number;
    },
    params: {
        projectId: string;
    }
}

export type CreateXeroProjectInput = {
    body: {
        contactId: string;
        name: string;
        estimateAmount?: number;
        deadlineUtc?: Date;
    }
}

enum XeroPhoneTypeEnum {
    DEFAULT,
    DDI,
    MOBILE,
    FAX,
    OFFICE
}

export type CreateXeroPhone = {
    phoneNumber: string;
    phoneType: XeroPhoneTypeEnum;
}

export type CreateXeroContact = {
    name: string;
    emailAddress: string;
    phones: [CreateXeroPhone];
}

export type CreateXeroContactInput = {
    contacts: [CreateXeroContact];
}

export declare enum TimesheetStatus {
    DRAFT,
    PROCESSED,
    APPROVED,
    REJECTED,
    REQUESTED
}

export type TimesheetLine = {
    /**
    * The Xero identifier for an Earnings Rate
    */
    earningsRateID?: string;
    /**
    * The Xero identifier for a Tracking Category. The TrackingOptionID must belong to the TrackingCategory selected as TimesheetCategories under Payroll Settings.
    */
    trackingItemID?: string;
    /**
    * The number of units on a timesheet line
    */
    numberOfUnits?: Array<number>;
    /**
    * Last modified timestamp
    */
    updatedDateUTC?: Date;
}


export type CreateXeroTimesheetInput = {
    employeeID: string;
    startDate: string;
    endDate: string;
    status?: TimesheetStatus;
    /**
    * Timesheet total hours
    */
    hours?: number;
    /**
    * The Xero identifier for a Payroll Timesheet
    */
    timesheetID?: string;
    timesheetLines?: Array<TimesheetLine>;
}


export declare enum XeroPayRunDaysOfWeek {
    THURSDAY = 0,
    FRIDAY = 1,
    SATURDAY = 2,
    SUNDAY = 3,
    MONDAY = 4,
    TUESDAY = 5,
    WEDNESDAY = 6,
}
