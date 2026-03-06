function responseSuccess(responseData: unknown) {
  return {
    message: 'success',
    statusCode: 200,
    data: responseData,
  };
}

export default responseSuccess;
