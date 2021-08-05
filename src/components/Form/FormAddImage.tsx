import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
import { stringify } from 'querystring';

type ImageFormData = {
  title: string;
  description: string;
  url: string;
}

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo Obrigatório',
      validate: {
        lessThanTen: v => parseInt(v[0].size) < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: v => /^[image/]+(png|jpeg|gif)$/.test(v[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
      }
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: 'Título Obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo 2 caracteres'
      },
      maxLength: {
        value: 20,
        message: 'Máximo 20 caracteres'
      }
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: 'Descrição Obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo 65 caracteres'
      }

    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(async (image: ImageFormData) => {
    // TODO MUTATION API POST,
    const newImage = {
      ...image,
      url: imageUrl
    }

    await api.post('images', newImage);
  },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      }
    });

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  //const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
  //const onSubmit = async (data: ImageFormData): Promise<void> => {
  const onSubmit: SubmitHandler<ImageFormData> = async (values) => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      // TODO EXECUTE ASYNC MUTATION
      await mutation.mutateAsync(values, {
        // TODO SHOW SUCCESS TOAST
        onSuccess: () => {
          toast({
            title: 'Imagem cadastrada',
            description: 'Sua imagem foi cadastrada com sucesso.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
      })
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          name='image'
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        // TODO SEND IMAGE ERRORS
        // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          name='title'
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        // TODO SEND TITLE ERRORS
        // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          name='description'
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        // TODO SEND DESCRIPTION ERRORS
        // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
