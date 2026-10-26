import * as React from "react";
import {
  View,
  ScrollView,
  Pressable,
  type ViewProps,
} from "react-native";
import { cn } from "../../utilities/cn";
import { Text } from "../text/text";
import { Input } from "../input/input";
import { Button } from "../button/button";
import { Card, CardContent } from "../card/card";
import { Skeleton } from "../skeleton/skeleton";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: number;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, any>> extends ViewProps {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  mode?: "table" | "card";
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  loading?: boolean;
  pageSize?: number;
  emptyText?: string;
  onRowPress?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor = (_, i) => String(i),
  mode = "card",
  searchable = true,
  searchPlaceholder = "Search records...",
  searchKeys,
  loading = false,
  pageSize = 5,
  emptyText = "No records found",
  onRowPress,
  className,
  ...props
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter
  const filteredData = React.useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    const keys = searchKeys || (columns.map((c) => c.key) as (keyof T)[]);

    return data.filter((item) => {
      return keys.some((k) => {
        const val = item[k];
        if (val == null) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, search, searchKeys, columns]);

  // Sort
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return sortDirection === "asc"
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (colKey: string) => {
    if (sortKey === colKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(colKey);
      setSortDirection("asc");
    }
  };

  return (
    <View className={cn("w-full gap-4", className)} {...props}>
      {/* Search Input */}
      {searchable && (
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChangeText={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          className="bg-card"
        />
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <View className="gap-3">
          {[1, 2, 3].map((idx) => (
            <Skeleton key={idx} className="h-20 w-full rounded-2xl" />
          ))}
        </View>
      ) : paginatedData.length === 0 ? (
        <Card className="items-center justify-center p-8">
          <Text className="text-muted text-base">{emptyText}</Text>
        </Card>
      ) : mode === "card" ? (
        /* Mobile Card Mode */
        <View className="gap-3">
          {paginatedData.map((item, idx) => (
            <Pressable
              key={keyExtractor(item, idx)}
              disabled={!onRowPress}
              onPress={() => onRowPress?.(item)}
              className="active:opacity-80"
            >
              <Card className="p-4 gap-2">
                {columns.map((col) => {
                  const rawVal = item[col.key as string];
                  const renderedVal = col.render ? col.render(rawVal, item) : String(rawVal ?? "—");

                  return (
                    <View
                      key={String(col.key)}
                      className="flex-row items-center justify-between py-1 border-b border-border/40 last:border-b-0"
                    >
                      <Text className="text-xs font-semibold text-muted uppercase tracking-wider">
                        {col.title}
                      </Text>
                      <View className="shrink">
                        {typeof renderedVal === "string" ? (
                          <Text className="text-sm font-medium text-foreground">
                            {renderedVal}
                          </Text>
                        ) : (
                          renderedVal
                        )}
                      </View>
                    </View>
                  );
                })}
              </Card>
            </Pressable>
          ))}
        </View>
      ) : (
        /* Horizontal Table Mode */
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Header */}
            <View className="flex-row bg-muted/10 border-b border-border">
              {columns.map((col) => (
                <Pressable
                  key={String(col.key)}
                  disabled={!col.sortable}
                  onPress={() => handleSort(String(col.key))}
                  style={{ width: col.width || 120 }}
                  className="px-4 py-3 flex-row items-center justify-between"
                >
                  <Text className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {col.title}
                  </Text>
                  {col.sortable && (
                    <Text className="text-xs text-muted">
                      {sortKey === col.key
                        ? sortDirection === "asc"
                          ? "▲"
                          : "▼"
                        : "⇅"}
                    </Text>
                  )}
                </Pressable>
              ))}
            </View>

            {/* Rows */}
            {paginatedData.map((item, idx) => (
              <Pressable
                key={keyExtractor(item, idx)}
                disabled={!onRowPress}
                onPress={() => onRowPress?.(item)}
                className="flex-row border-b border-border/60 active:bg-muted/10"
              >
                {columns.map((col) => {
                  const rawVal = item[col.key as string];
                  const renderedVal = col.render ? col.render(rawVal, item) : String(rawVal ?? "—");

                  return (
                    <View
                      key={String(col.key)}
                      style={{ width: col.width || 120 }}
                      className="px-4 py-3 justify-center"
                    >
                      {typeof renderedVal === "string" ? (
                        <Text className="text-sm text-foreground">{renderedVal}</Text>
                      ) : (
                        renderedVal
                      )}
                    </View>
                  );
                })}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <View className="flex-row items-center justify-between pt-2">
          <Text className="text-xs text-muted">
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length}
          </Text>

          <View className="flex-row items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Text className="text-xs font-medium text-foreground px-1">
              {currentPage} / {totalPages}
            </Text>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
