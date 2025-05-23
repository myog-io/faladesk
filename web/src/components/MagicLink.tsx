import { VStack, Text } from '@gluestack-ui/themed'
import { useI18n } from '../i18n'

export default function MagicLink() {
  const { t } = useI18n()
  return (
    <VStack space="md" p="$4">
      <Text>{t('check_magic_link')}</Text>
    </VStack>
  )
}
