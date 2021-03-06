import { useState, useContext, useEffect } from 'react';
import { ThemeContext } from 'styled-components';
import { useHistory } from 'react-router-dom';

import InputText from 'components/Form/InputText';
import Textarea from 'components/Form/Textarea';
import Menu from 'components/Menu';
import Select from 'components/Form/Select';
import CodeEditor from 'components/CodeEditor';
import ColorPicker from 'components/Form/ColorPicker';
import Button from 'components/Button';
import languages from 'utils/languages';
import { api } from 'services/api';

import * as S from './styles';

type EditorDeCodigoProps = {
  project?: {
    id: number;
    title: string;
    description: string;
    language: string;
    color: string;
    code: string;
  };
};

interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  description: HTMLTextAreaElement;
  language: HTMLSelectElement;
  color: HTMLInputElement;
}

interface ProjectFormElements extends HTMLFormElement {
  readonly elements: FormElements;
}

const EditorDeCodigo: React.FC<EditorDeCodigoProps> = ({ project }) => {
  const themeContext = useContext(ThemeContext);
  const { push } = useHistory();
  const [bgCodeColor, setbgCodeColor] = useState(themeContext.colors.defaultCodeBgColor);
  const [language, setLanguage] = useState('');
  const [highlight, setHighlight] = useState(false);
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  useEffect(() => {
    if (project) {
      setLanguage(project.language);
      setCode(project.code);
      setbgCodeColor(project.color);
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent<ProjectFormElements>) => {
    e.preventDefault();
    const formElements = e.currentTarget.elements;
    const title = formElements.title.value;
    const description = formElements.description.value;

    const data = {
      title,
      description,
      language,
      color: bgCodeColor,
      code,
    };

    const submitForm = () => {
      if (project) {
        api.put(`projects/${project.id}`, data);
      } else {
        api.post('projects', data);
      }
      setErrorMessage(null);
      setbgCodeColor(themeContext.colors.defaultCodeBgColor);
      setCode('');
      e.currentTarget.reset();
      project && push('/comunidade');
    };

    title === ''
      ? setErrorMessage('Nome do projeto ?? obrigat??rio!')
      : description === ''
      ? setErrorMessage('Descri????o do projeto ?? obrigat??ria')
      : language === ''
      ? setErrorMessage('Selecione uma linguagem!')
      : code === ''
      ? setErrorMessage('Escreva seu c??digo!')
      : submitForm();
  };

  return (
    <S.Container>
      <S.Column>
        <Menu />
      </S.Column>
      <S.Content>
        <CodeEditor
          bgColor={bgCodeColor}
          language={language}
          highlight={highlight}
          code={code}
          setCode={setCode}
        />
        <Button variant="secondary" onClick={() => setHighlight(!highlight)}>
          {highlight ? 'Visualizar sem o highlight' : 'Visualizar com o highlight'}
        </Button>
        {highlight && language === '' && <S.Message>Selecione uma linguagem!</S.Message>}
      </S.Content>
      <S.Column>
        <form onSubmit={(e: React.FormEvent<ProjectFormElements>) => handleSubmit(e)}>
          <h6>Seu projeto</h6>
          <InputText
            placeholder="Nome do seu projeto"
            name="title"
            defaultValue={project ? project.title : ''}
          />
          <Textarea
            placeholder="Descri????o do seu projeto"
            name="description"
            rows={3}
            defaultValue={project ? project.description : undefined}
          />
          <h6>Personaliza????o</h6>
          <Select
            name="language"
            options={languages}
            placeholder="Selecione a linguagem"
            setValue={setLanguage}
            defaultValue={project ? language : undefined}
          />
          <ColorPicker name="color" color={bgCodeColor} setColor={setbgCodeColor} />
          <Button variant="primary" type="submit">
            Salvar projeto
          </Button>
          {errorMessage && <S.Message>{errorMessage}</S.Message>}
        </form>
      </S.Column>
    </S.Container>
  );
};

export default EditorDeCodigo;
