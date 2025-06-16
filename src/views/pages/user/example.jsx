import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

import Pages from '../../components/Base/styled/Pages';
import ClassifyInput from '../../components/user/Classify-Page/ClassifyInput';
import ClassifyResult from '../../components/user/Classify-Page/ClassifyResult';

import { classifyNews } from '../states/classifier/thunk';
import { asyncFetchModels } from '../states/models/thunk';
import { setSelectedModel } from '../states/models/action';
import { showFormattedDate } from '../utils/helper';
import { setSelectedDataset } from '../states/datasets/action';
import { setSelectedPreprocessedDataset } from '../states/preprocessedDatasets/action';

const ClassifyPage = () => {
  const dispatch = useDispatch();
  const firstRun = useRef(true);

  const { predictionResults, loading, classifyLoading } = useSelector((state) => state.classifier);
  const { models, selectedModelId } = useSelector((state) => state.models);

  const inputAtBottom = !!predictionResults?.length;

  const suggestions = [
    'Pasar Saham Menurun Semenjak Covid-19, Apa Penyebabnya?',
    'Tim Sepak Bola Indonesia Jadi Pemenang Liga Inggris.',
    'Film Spiderman No Way Home yang diperankan Tom Holand Bisa Ditonton di Netflix.',
    'Kemajuan teknologi AI di China semakin menggemparkan dunia.',
    'Makan makanan yang bergizi dapat membantu meningkatkan kesehatan tubuh.',
  ];

  useEffect(() => {
    const loadData = async () => {
      await dispatch(asyncFetchModels());
    };
    loadData();
  }, [dispatch]);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [predictionResults]);

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    const foundModel = models.find((model) => model.id === modelId);
    dispatch(setSelectedModel(modelId, foundModel?.model_path || ''));
    dispatch(setSelectedDataset(foundModel?.raw_dataset_id));
    dispatch(setSelectedPreprocessedDataset(foundModel?.preprocessed_dataset_id));
  };

  const predictNews = async (text) => {
    if (!text) {
      alert('Please enter a news text');
      return;
    }
    await dispatch(classifyNews(text));
  };

  return (
    <Pages className='classifier-page'>
      <div className='classify-page'>
        <div className='small-page'>
          {/* Input Section di Atas */}
          <AnimatePresence>
            {!inputAtBottom && (
              <>
                <p></p>
                <motion.div
                  className='input-section'
                  key='top-input'
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0 }}
                >
                  <h2>Any news to classify?</h2>
                  <ClassifyInput
                    predictNews={predictNews}
                    loading={classifyLoading}
                    models={models}
                    selectedModelId={selectedModelId || ''}
                    handleModelChange={handleModelChange}
                    showFormattedDate={showFormattedDate}
                    suggestions={suggestions}
                    inputAtBottom={inputAtBottom}
                  />
                </motion.div>
                <p></p>
                <p></p>
              </>
            )}
          </AnimatePresence>

          {/* Input Section di Bawah */}
          <AnimatePresence>
            {inputAtBottom && (
              <>
                {/* Chat Section */}
                <div className='chat-section' ref={chatRef}>
                  {predictionResults.map((result, idx) => (
                    <ClassifyResult
                      key={idx}
                      preprocessedText={result.text}
                      hybridPredict={result.hybrid}
                      deepseekPredict={result.deepseek}
                      loading={classifyLoading}
                      idx={idx}
                    />
                  ))}
                </div>
                <motion.div
                  className='input-section'
                  key='bottom-input'
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                  transition={{ duration: 0 }}
                >
                  <ClassifyInput
                    predictNews={predictNews}
                    loading={classifyLoading}
                    models={models}
                    selectedModelId={selectedModelId || ''}
                    handleModelChange={handleModelChange}
                    showFormattedDate={showFormattedDate}
                    inputAtBottom={inputAtBottom}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <p className='copyright'> &copy; Copyright Kelompok 5</p>
    </Pages>
  );
};

export default ClassifyPage;
