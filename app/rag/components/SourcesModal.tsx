import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  Spacer,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';
import useModalInfo from '@/app/hooks/useModalInfo';
import {
  collectionExists,
  createCollection,
  deleteCollection,
  getCollectionsList,
  scrollPoints,
  upsertPoints,
} from '@/app/utils/collection';

export function AddSourceTab({
  onAddCollection,
  isLoading = false,
}: {
  onAddCollection: (name: string, source: string) => void;
  isLoading?: boolean;
}) {
  const [name, setName] = useState<string>('');
  const [source, setSource] = useState('');
  return (
    <div className="flex flex-col gap-4 w-full h-80">
      <Input
        placeholder="Name"
        value={name}
        onValueChange={(value) => setName(value)}
      />
      <Textarea
        placeholder="Enter the source"
        className="w-full "
        minRows={9}
        maxRows={9}
        value={source}
        onValueChange={(value) => setSource(value)}
      />
      <Button
        variant="flat"
        className="w-fit self-end"
        isDisabled={!name || !source}
        isLoading={isLoading}
        onPress={() => {
          onAddCollection(name, source);
        }}
      >
        Add
      </Button>
    </div>
  );
}

export function SourcesTab({
  collection,
  isLoading,
  onClose,
  handleDeleteCollection,
  handleSelectCollection,
}: {
  collection: string;
  isLoading: boolean;
  onClose: () => void;
  handleDeleteCollection: (collection: string) => void;
  handleSelectCollection: (collection: string) => void;
}) {
  const [collectionContent, setCollectionContent] = useState<string>('');

  const { openModalInfo } = useModalInfo();

  const fetchCollectionContent = async (name: string) => {
    type ScrollPoints = {
      payload: string;
    };
    try {
      const content = (await scrollPoints(name)) as ScrollPoints[];
      setCollectionContent(content.map((item) => item.payload).join('\n'));
    } catch (e) {
      throw new Error('Failed to fetch collection content');
    }
  };

  try {
    fetchCollectionContent(collection);
  } catch (e) {
    openModalInfo({
      title: 'Error',
      message: 'Failed to fetch collection content',
    });
  }

  return (
    <div className="flex flex-col gap-4 w-full h-80">
      <ScrollShadow className="h-full">{collectionContent}</ScrollShadow>
      <div className="flex self-end gap-3">
        <Button
          className="w-fit"
          color="danger"
          variant="light"
          isLoading={isLoading}
          onPress={() => handleDeleteCollection(collection)}
        >
          Delete
        </Button>
        <Button
          className="w-fit"
          color="primary"
          onPress={() => {
            handleSelectCollection(collection);
            onClose();
          }}
        >
          Select
        </Button>
      </div>
    </div>
  );
}

export function SourcesModal({
  handleSelectCollection,
  selectedCollection,
}: {
  handleSelectCollection: (collection: string) => void;
  selectedCollection: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [collectionList, setCollectionList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { openModalInfo } = useModalInfo();

  const handleAddSource = async (name: string, source: string) => {
    setIsLoading(true);
    const exist = await collectionExists(name);
    if (exist) {
      setIsLoading(false);
      openModalInfo({
        title: 'Error',
        message: 'Collection already exists',
      });
      return;
    }
    try {
      await createCollection(name);
    } catch (e) {
      setIsLoading(false);
      openModalInfo({
        title: 'Error',
        message: 'Failed to create collection',
      });
      return;
    }
    await upsertPoints(name, source);
    await getCollectionsList().then((collections) => {
      setCollectionList(collections.map((collection) => collection.name));
    });
    setIsLoading(false);
  };

  const handleDeleteCollection = async (name: string) => {
    setIsLoading(true);
    try {
      await deleteCollection(name);
    } catch (e) {
      openModalInfo({
        title: 'Error',
        message: 'Failed to delete collection',
      });
      setIsLoading(false);
      return;
    }
    await getCollectionsList().then((collections) => {
      setCollectionList(collections.map((collection) => collection.name));
    });
    setIsLoading(false);
  };

  const handleOpenModal = () => {
    onOpen();
    getCollectionsList()
      .then((collections) => {
        setCollectionList(collections.map((collection) => collection.name));
      })
      .catch((e) => {
        console.error(e);
        openModalInfo({
          title: 'Error',
          message: 'Failed to fetch collections',
        });
      });
  };

  const isSmallScreen = window.innerWidth < 640;

  return (
    <>
      <Button
        size="sm"
        color={selectedCollection ? 'success' : 'default'}
        onPress={handleOpenModal}
        variant="flat"
      >
        Sources {selectedCollection && `("${selectedCollection}" selected)`}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Sources</ModalHeader>
              <ModalBody className="w-full">
                <Tabs
                  aria-label="Options"
                  isVertical={!isSmallScreen}
                  className="w-full sm:w-fit h-full flex flex-col gap-4"
                >
                  <Tab
                    title="Add a new source"
                    key={0}
                    className="flex flex-col w-full gap-4"
                  >
                    <AddSourceTab
                      isLoading={isLoading}
                      onAddCollection={handleAddSource}
                    />
                  </Tab>
                  {collectionList.map((collection, index) => (
                    <Tab
                      title={collection}
                      key={index + 1}
                      className="flex flex-col w-full gap-4"
                    >
                      <SourcesTab
                        collection={collection}
                        handleDeleteCollection={handleDeleteCollection}
                        handleSelectCollection={handleSelectCollection}
                        isLoading={isLoading}
                        onClose={onClose}
                      />
                    </Tab>
                  ))}
                </Tabs>
              </ModalBody>
              <Spacer />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
