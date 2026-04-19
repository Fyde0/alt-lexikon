import { Text } from "@mantine/core";

function Flag({ language }: { language: string }) {
  const flag = language === "English" ? "🇬🇧" : "🇸🇪";

  return (
    <Text span aria-label={language} role="img">
      {flag}
    </Text>
  );
}

export default Flag;
