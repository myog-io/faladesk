import { Heading, Text, VStack } from '@gluestack-ui/themed'
import { useI18n } from '../i18n'

export default function Landing() {
  const { t } = useI18n()
  return (
    <VStack space="sm">
      <Heading>Faladesk</Heading>
      <Text>{t('multi_tenant_platform')}</Text>
    </VStack>
  )
}
