import { formatDate, type Confirmation } from "@edupro/domain";
export class NotificationResolver {
  static resolveList(confirmations: Confirmation[], locale = "pt-BR") {
    return confirmations.map((item) => ({
      ...item,
      date: formatDate(item.createdAt, locale),
      label: `${item.studentName} — ${item.courseName}`,
    }));
  }
}
